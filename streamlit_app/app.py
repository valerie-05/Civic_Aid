import streamlit as st
import os
from datetime import datetime, timedelta
from supabase import create_client

st.set_page_config(
    page_title="Crisis Guidance Admin Dashboard",
    page_icon="🚨",
    layout="wide",
    initial_sidebar_state="expanded"
)

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    st.error("Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.")
    st.stop()

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

st.title("🚨 Crisis Guidance Admin Dashboard")
st.markdown("---")

page = st.sidebar.selectbox(
    "Navigation",
    ["Overview", "Scenarios Management", "Chat Analytics", "Resources Management", "AI Performance"]
)

if page == "Overview":
    st.header("📊 System Overview")

    col1, col2, col3, col4 = st.columns(4)

    try:
        scenarios_response = supabase.table('crisis_scenarios').select('*', count='exact').execute()
        total_scenarios = scenarios_response.count if scenarios_response.count else 0

        sessions_response = supabase.table('chat_sessions').select('*', count='exact').execute()
        total_sessions = sessions_response.count if sessions_response.count else 0

        messages_response = supabase.table('chat_messages').select('*', count='exact').execute()
        total_messages = messages_response.count if messages_response.count else 0

        resources_response = supabase.table('resources').select('*', count='exact').execute()
        total_resources = resources_response.count if resources_response.count else 0

        col1.metric("Total Scenarios", total_scenarios)
        col2.metric("Chat Sessions", total_sessions)
        col3.metric("Messages Sent", total_messages)
        col4.metric("Resources", total_resources)

        st.markdown("---")

        st.subheader("📈 Recent Activity")

        today = datetime.now().date()
        week_ago = today - timedelta(days=7)

        recent_sessions = supabase.table('chat_sessions')\
            .select('*')\
            .gte('created_at', week_ago.isoformat())\
            .order('created_at', desc=True)\
            .limit(10)\
            .execute()

        if recent_sessions.data:
            st.write(f"**{len(recent_sessions.data)} sessions in the last 7 days**")

            for session in recent_sessions.data[:5]:
                created = datetime.fromisoformat(session['created_at'].replace('Z', '+00:00'))
                st.text(f"🔵 {created.strftime('%Y-%m-%d %H:%M')} - Session in {session['language'].upper()}")
        else:
            st.info("No recent activity")

        st.markdown("---")

        st.subheader("🔥 Most Critical Scenarios")
        critical_scenarios = supabase.table('crisis_scenarios')\
            .select('*')\
            .eq('severity', 'critical')\
            .execute()

        if critical_scenarios.data:
            for scenario in critical_scenarios.data:
                st.warning(f"**{scenario['title']}** - {scenario['category']}")
        else:
            st.success("No critical scenarios configured")

    except Exception as e:
        st.error(f"Error loading overview data: {str(e)}")

elif page == "Scenarios Management":
    st.header("📋 Crisis Scenarios Management")

    tab1, tab2 = st.tabs(["View Scenarios", "Add New Scenario"])

    with tab1:
        try:
            scenarios = supabase.table('crisis_scenarios').select('*').order('severity', desc=True).execute()

            if scenarios.data:
                for scenario in scenarios.data:
                    with st.expander(f"{scenario['title']} ({scenario['severity'].upper()})"):
                        st.write(f"**Category:** {scenario['category']}")
                        st.write(f"**Description:** {scenario['description']}")
                        st.write(f"**Created:** {scenario['created_at']}")

                        if st.button(f"Delete", key=f"delete_{scenario['id']}"):
                            supabase.table('crisis_scenarios').delete().eq('id', scenario['id']).execute()
                            st.success("Scenario deleted!")
                            st.rerun()
            else:
                st.info("No scenarios found")
        except Exception as e:
            st.error(f"Error loading scenarios: {str(e)}")

    with tab2:
        with st.form("new_scenario"):
            title = st.text_input("Title")
            description = st.text_area("Description")
            category = st.selectbox("Category", [
                "ice_detention",
                "deportation",
                "visa_issues",
                "government_shutdown",
                "work_authorization",
                "asylum"
            ])
            severity = st.selectbox("Severity", ["low", "medium", "high", "critical"])

            submitted = st.form_submit_button("Add Scenario")
            if submitted and title and description:
                try:
                    supabase.table('crisis_scenarios').insert({
                        'title': title,
                        'description': description,
                        'category': category,
                        'severity': severity
                    }).execute()
                    st.success("Scenario added successfully!")
                except Exception as e:
                    st.error(f"Error adding scenario: {str(e)}")

elif page == "Chat Analytics":
    st.header("💬 Chat Analytics")

    try:
        col1, col2 = st.columns(2)

        with col1:
            st.subheader("Language Distribution")
            sessions = supabase.table('chat_sessions').select('language').execute()

            if sessions.data:
                language_counts = {}
                for session in sessions.data:
                    lang = session['language']
                    language_counts[lang] = language_counts.get(lang, 0) + 1

                st.bar_chart(language_counts)
            else:
                st.info("No chat data available")

        with col2:
            st.subheader("Messages Over Time")
            messages = supabase.table('chat_messages')\
                .select('created_at')\
                .order('created_at', desc=False)\
                .execute()

            if messages.data:
                dates = {}
                for msg in messages.data:
                    date = datetime.fromisoformat(msg['created_at'].replace('Z', '+00:00')).date()
                    dates[str(date)] = dates.get(str(date), 0) + 1

                st.line_chart(dates)
            else:
                st.info("No message data available")

        st.markdown("---")

        st.subheader("Recent Conversations")
        recent_messages = supabase.table('chat_messages')\
            .select('*')\
            .order('created_at', desc=True)\
            .limit(20)\
            .execute()

        if recent_messages.data:
            for msg in recent_messages.data:
                role_icon = "👤" if msg['role'] == 'user' else "🤖"
                created = datetime.fromisoformat(msg['created_at'].replace('Z', '+00:00'))
                st.text(f"{role_icon} [{created.strftime('%Y-%m-%d %H:%M')}] {msg['content'][:100]}...")
        else:
            st.info("No recent messages")

    except Exception as e:
        st.error(f"Error loading analytics: {str(e)}")

elif page == "Resources Management":
    st.header("📚 Resources Management")

    tab1, tab2 = st.tabs(["View Resources", "Add New Resource"])

    with tab1:
        try:
            resources = supabase.table('resources').select('*').order('is_emergency', desc=True).execute()

            if resources.data:
                for resource in resources.data:
                    with st.expander(f"{'🚨' if resource['is_emergency'] else '📖'} {resource['name']}"):
                        st.write(f"**Description:** {resource['description']}")
                        if resource.get('url'):
                            st.write(f"**URL:** {resource['url']}")
                        if resource.get('phone_number'):
                            st.write(f"**Phone:** {resource['phone_number']}")
                        st.write(f"**Categories:** {', '.join(resource['categories'])}")
                        st.write(f"**Languages:** {', '.join(resource['languages_supported'])}")
            else:
                st.info("No resources found")
        except Exception as e:
            st.error(f"Error loading resources: {str(e)}")

    with tab2:
        with st.form("new_resource"):
            name = st.text_input("Resource Name")
            description = st.text_area("Description")
            url = st.text_input("URL (optional)")
            phone = st.text_input("Phone Number (optional)")
            is_emergency = st.checkbox("Emergency Resource")

            categories = st.multiselect("Categories", [
                "ice_detention",
                "deportation",
                "visa_issues",
                "government_shutdown",
                "work_authorization",
                "asylum"
            ])

            languages = st.multiselect("Languages Supported", ["en", "es", "zh", "ar", "fr"])

            submitted = st.form_submit_button("Add Resource")
            if submitted and name and description and categories and languages:
                try:
                    supabase.table('resources').insert({
                        'name': name,
                        'description': description,
                        'url': url if url else None,
                        'phone_number': phone if phone else None,
                        'is_emergency': is_emergency,
                        'categories': categories,
                        'languages_supported': languages
                    }).execute()
                    st.success("Resource added successfully!")
                except Exception as e:
                    st.error(f"Error adding resource: {str(e)}")

elif page == "AI Performance":
    st.header("🤖 AI Performance Metrics")

    try:
        messages = supabase.table('chat_messages').select('*').execute()

        if messages.data:
            total_messages = len(messages.data)
            user_messages = len([m for m in messages.data if m['role'] == 'user'])
            assistant_messages = len([m for m in messages.data if m['role'] == 'assistant'])
            matched_scenarios = len([m for m in messages.data if m.get('matched_scenario_id')])

            col1, col2, col3 = st.columns(3)
            col1.metric("Total Messages", total_messages)
            col2.metric("User Queries", user_messages)
            col3.metric("AI Responses", assistant_messages)

            st.markdown("---")

            if user_messages > 0:
                match_rate = (matched_scenarios / user_messages) * 100
                st.metric("Scenario Match Rate", f"{match_rate:.1f}%")

                if match_rate >= 70:
                    st.success("Excellent AI performance!")
                elif match_rate >= 50:
                    st.warning("Good AI performance, but could be improved")
                else:
                    st.error("AI needs improvement - consider updating keywords or using better LLM")

            st.markdown("---")

            st.subheader("Matched Scenarios Distribution")

            scenario_matches = {}
            for msg in messages.data:
                if msg.get('matched_scenario_id'):
                    scenario_id = msg['matched_scenario_id']
                    scenario_matches[scenario_id] = scenario_matches.get(scenario_id, 0) + 1

            if scenario_matches:
                for scenario_id, count in sorted(scenario_matches.items(), key=lambda x: x[1], reverse=True):
                    scenario = supabase.table('crisis_scenarios').select('title').eq('id', scenario_id).maybeSingle().execute()
                    title = scenario.data['title'] if scenario.data else 'Unknown'
                    st.write(f"**{title}**: {count} matches")
            else:
                st.info("No scenario matches yet")
        else:
            st.info("No AI interaction data available yet")

    except Exception as e:
        st.error(f"Error loading AI metrics: {str(e)}")

st.sidebar.markdown("---")
st.sidebar.info(
    "**Crisis Guidance Admin Dashboard**\n\n"
    "Built with Streamlit for HackUMBC\n\n"
    "Manage scenarios, monitor AI performance, and view analytics."
)
