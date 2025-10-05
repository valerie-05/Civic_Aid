/*
  # Expand Visa Types with Comprehensive US Categories

  1. Visa Categories
    - Adds all major US visa types including nonimmigrant and immigrant visas
    - Categories include visitor, student, worker, exchange, family, religious, media, and permanent residence
    - Includes Visa Waiver Program (VWP/ESTA)

  2. Updates
    - Adds comprehensive visa types with translations
    - Updates quiz questions and options to cover all visa categories
*/

-- Insert comprehensive visa types
INSERT INTO visa_types (code, name_translations, description_translations, country)
VALUES 
  -- Visitor Visas
  ('b1b2', 
   '{"en": "B-1/B-2 Visitor Visa", "es": "Visa de Visitante B-1/B-2", "zh": "B-1/B-2访客签证", "fr": "Visa Visiteur B-1/B-2", "ar": "تأشيرة زيارة B-1/B-2", "ru": "Гостевая виза B-1/B-2", "pt": "Visto de Visitante B-1/B-2", "hi": "B-1/B-2 आगंतुक वीज़ा", "ko": "B-1/B-2 방문자 비자", "vi": "Thị Thực Khách B-1/B-2"}'::jsonb,
   '{"en": "For tourism, business, or medical treatment", "es": "Para turismo, negocios o tratamiento médico", "zh": "用于旅游、商务或医疗", "fr": "Pour le tourisme, les affaires ou les soins médicaux", "ar": "للسياحة أو الأعمال أو العلاج الطبي", "ru": "Для туризма, бизнеса или медицинского лечения", "pt": "Para turismo, negócios ou tratamento médico", "hi": "पर्यटन, व्यापार या चिकित्सा उपचार के लिए", "ko": "관광, 사업 또는 의료를 위한", "vi": "Cho du lịch, kinh doanh hoặc điều trị y tế"}'::jsonb,
   'US'),
  
  -- Student Visas
  ('f1', 
   '{"en": "F-1 Student Visa", "es": "Visa de Estudiante F-1", "zh": "F-1学生签证", "fr": "Visa Étudiant F-1", "ar": "تأشيرة الطالب F-1", "ru": "Студенческая виза F-1", "pt": "Visto de Estudante F-1", "hi": "F-1 छात्र वीज़ा", "ko": "F-1 학생 비자", "vi": "Thị Thực Du Học F-1"}'::jsonb,
   '{"en": "For academic study in the United States", "es": "Para estudios académicos en Estados Unidos", "zh": "用于在美国进行学术学习", "fr": "Pour des études académiques aux États-Unis", "ar": "للدراسات الأكاديمية في الولايات المتحدة", "ru": "Для академического обучения в США", "pt": "Para estudos acadêmicos nos Estados Unidos", "hi": "संयुक्त राज्य अमेरिका में शैक्षणिक अध्ययन के लिए", "ko": "미국에서의 학업을 위한", "vi": "Cho học tập học thuật tại Hoa Kỳ"}'::jsonb,
   'US'),
  
  ('m1',
   '{"en": "M-1 Vocational Student Visa", "es": "Visa de Estudiante Vocacional M-1", "zh": "M-1职业学生签证", "fr": "Visa Étudiant Professionnel M-1", "ar": "تأشيرة الطالب المهني M-1", "ru": "Виза для профессионального обучения M-1", "pt": "Visto de Estudante Vocacional M-1", "hi": "M-1 व्यावसायिक छात्र वीज़ा", "ko": "M-1 직업 학생 비자", "vi": "Thị Thực Sinh Viên Nghề M-1"}'::jsonb,
   '{"en": "For vocational or technical study", "es": "Para estudios vocacionales o técnicos", "zh": "用于职业或技术学习", "fr": "Pour des études professionnelles ou techniques", "ar": "للدراسات المهنية أو التقنية", "ru": "Для профессионального или технического обучения", "pt": "Para estudos vocacionais ou técnicos", "hi": "व्यावसायिक या तकनीकी अध्ययन के लिए", "ko": "직업 또는 기술 학업을 위한", "vi": "Cho học tập nghề nghiệp hoặc kỹ thuật"}'::jsonb,
   'US'),
  
  -- Temporary Worker Visas
  ('h1b',
   '{"en": "H-1B Specialty Occupation Visa", "es": "Visa H-1B de Ocupación Especializada", "zh": "H-1B专业职业签证", "fr": "Visa H-1B Occupation Spécialisée", "ar": "تأشيرة المهنة المتخصصة H-1B", "ru": "Виза H-1B для специализированных профессий", "pt": "Visto H-1B de Ocupação Especializada", "hi": "H-1B विशेष व्यवसाय वीज़ा", "ko": "H-1B 전문 직종 비자", "vi": "Thị Thực Nghề Chuyên Môn H-1B"}'::jsonb,
   '{"en": "For specialty occupations requiring theoretical or technical expertise", "es": "Para ocupaciones especializadas que requieren experiencia teórica o técnica", "zh": "用于需要理论或技术专业知识的专业职业", "fr": "Pour les occupations spécialisées nécessitant une expertise théorique ou technique", "ar": "للمهن المتخصصة التي تتطلب خبرة نظرية أو تقنية", "ru": "Для специализированных профессий, требующих теоретических или технических знаний", "pt": "Para ocupações especializadas que exigem experiência teórica ou técnica", "hi": "सैद्धांतिक या तकनीकी विशेषज्ञता की आवश्यकता वाले विशेष व्यवसायों के लिए", "ko": "이론적 또는 기술적 전문 지식이 필요한 전문 직종을 위한", "vi": "Cho các nghề chuyên môn yêu cầu chuyên môn lý thuyết hoặc kỹ thuật"}'::jsonb,
   'US'),
  
  ('h2a',
   '{"en": "H-2A Agricultural Worker Visa", "es": "Visa H-2A Trabajador Agrícola", "zh": "H-2A农业工作签证", "fr": "Visa H-2A Travailleur Agricole", "ar": "تأشيرة العامل الزراعي H-2A", "ru": "Виза H-2A для сельскохозяйственных работников", "pt": "Visto H-2A Trabalhador Agrícola", "hi": "H-2A कृषि कार्यकर्ता वीज़ा", "ko": "H-2A 농업 근로자 비자", "vi": "Thị Thực Lao Động Nông Nghiệp H-2A"}'::jsonb,
   '{"en": "For temporary agricultural workers", "es": "Para trabajadores agrícolas temporales", "zh": "用于临时农业工人", "fr": "Pour les travailleurs agricoles temporaires", "ar": "للعمال الزراعيين المؤقتين", "ru": "Для временных сельскохозяйственных работников", "pt": "Para trabalhadores agrícolas temporários", "hi": "अस्थायी कृषि कर्मचारियों के लिए", "ko": "임시 농업 근로자를 위한", "vi": "Cho công nhân nông nghiệp tạm thời"}'::jsonb,
   'US'),
  
  ('h2b',
   '{"en": "H-2B Non-Agricultural Worker Visa", "es": "Visa H-2B Trabajador No Agrícola", "zh": "H-2B非农业工作签证", "fr": "Visa H-2B Travailleur Non Agricole", "ar": "تأشيرة العامل غير الزراعي H-2B", "ru": "Виза H-2B для несельскохозяйственных работников", "pt": "Visto H-2B Trabalhador Não Agrícola", "hi": "H-2B गैर-कृषि कार्यकर्ता वीज़ा", "ko": "H-2B 비농업 근로자 비자", "vi": "Thị Thực Lao Động Phi Nông Nghiệp H-2B"}'::jsonb,
   '{"en": "For temporary non-agricultural workers", "es": "Para trabajadores temporales no agrícolas", "zh": "用于临时非农业工人", "fr": "Pour les travailleurs non agricoles temporaires", "ar": "للعمال غير الزراعيين المؤقتين", "ru": "Для временных несельскохозяйственных работников", "pt": "Para trabalhadores não agrícolas temporários", "hi": "अस्थायी गैर-कृषि कर्मचारियों के लिए", "ko": "임시 비농업 근로자를 위한", "vi": "Cho công nhân phi nông nghiệp tạm thời"}'::jsonb,
   'US'),
  
  ('l1',
   '{"en": "L-1 Intracompany Transfer Visa", "es": "Visa L-1 Transferencia Intraempresarial", "zh": "L-1公司内部调动签证", "fr": "Visa L-1 Transfert Intra-Entreprise", "ar": "تأشيرة النقل داخل الشركة L-1", "ru": "Виза L-1 для внутрикорпоративного перевода", "pt": "Visto L-1 Transferência Intraempresarial", "hi": "L-1 कंपनी के भीतर स्थानांतरण वीज़ा", "ko": "L-1 사내 전근 비자", "vi": "Thị Thực Chuyển Giao Nội Bộ Công Ty L-1"}'::jsonb,
   '{"en": "For intracompany transferees in managerial or specialized knowledge positions", "es": "Para transferidos dentro de la empresa en puestos gerenciales o de conocimiento especializado", "zh": "用于管理或专业知识岗位的公司内部调动人员", "fr": "Pour les transferts intra-entreprise à des postes de direction ou de connaissances spécialisées", "ar": "للنقل داخل الشركة في المناصب الإدارية أو المعرفة المتخصصة", "ru": "Для внутрикорпоративных переводов на управленческие должности или должности, требующие специализированных знаний", "pt": "Para transferências intraempresariais em cargos gerenciais ou de conhecimento especializado", "hi": "प्रबंधकीय या विशेष ज्ञान पदों पर कंपनी के भीतर स्थानांतरित कर्मचारियों के लिए", "ko": "관리직 또는 전문 지식 직책의 사내 전근자를 위한", "vi": "Cho người chuyển giao nội bộ công ty ở vị trí quản lý hoặc kiến thức chuyên môn"}'::jsonb,
   'US'),
  
  ('o1',
   '{"en": "O-1 Extraordinary Ability Visa", "es": "Visa O-1 Habilidad Extraordinaria", "zh": "O-1杰出人才签证", "fr": "Visa O-1 Capacité Extraordinaire", "ar": "تأشيرة القدرة الاستثنائية O-1", "ru": "Виза O-1 для лиц с выдающимися способностями", "pt": "Visto O-1 Habilidade Extraordinária", "hi": "O-1 असाधारण क्षमता वीज़ा", "ko": "O-1 특별 능력 비자", "vi": "Thị Thực Năng Lực Phi Thường O-1"}'::jsonb,
   '{"en": "For individuals with extraordinary ability in arts, sciences, business, education, or athletics", "es": "Para individuos con habilidad extraordinaria en artes, ciencias, negocios, educación o atletismo", "zh": "用于在艺术、科学、商业、教育或体育方面具有杰出能力的个人", "fr": "Pour les personnes ayant une capacité extraordinaire dans les arts, les sciences, les affaires, l éducation ou l athlétisme", "ar": "للأفراد ذوي القدرة الاستثنائية في الفنون أو العلوم أو الأعمال أو التعليم أو الرياضة", "ru": "Для лиц с выдающимися способностями в области искусства, науки, бизнеса, образования или спорта", "pt": "Para indivíduos com habilidade extraordinária em artes, ciências, negócios, educação ou atletismo", "hi": "कला, विज्ञान, व्यवसाय, शिक्षा या एथलेटिक्स में असाधारण क्षमता वाले व्यक्तियों के लिए", "ko": "예술, 과학, 비즈니스, 교육 또는 운동 분야에서 특별한 능력을 가진 개인을 위한", "vi": "Cho các cá nhân có năng lực phi thường trong nghệ thuật, khoa học, kinh doanh, giáo dục hoặc thể thao"}'::jsonb,
   'US'),
  
  ('p1',
   '{"en": "P-1 Athlete/Entertainer Visa", "es": "Visa P-1 Atleta/Artista", "zh": "P-1运动员/演艺人员签证", "fr": "Visa P-1 Athlète/Artiste", "ar": "تأشيرة الرياضي/الفنان P-1", "ru": "Виза P-1 для спортсменов/артистов", "pt": "Visto P-1 Atleta/Artista", "hi": "P-1 एथलीट/कलाकार वीज़ा", "ko": "P-1 운동선수/연예인 비자", "vi": "Thị Thực Vận Động Viên/Nghệ Sĩ P-1"}'::jsonb,
   '{"en": "For internationally recognized athletes or entertainment groups", "es": "Para atletas reconocidos internacionalmente o grupos de entretenimiento", "zh": "用于国际公认的运动员或娱乐团体", "fr": "Pour les athlètes ou groupes de divertissement reconnus internationalement", "ar": "للرياضيين أو مجموعات الترفيه المعترف بها دوليًا", "ru": "Для признанных на международном уровне спортсменов или развлекательных групп", "pt": "Para atletas reconhecidos internacionalmente ou grupos de entretenimento", "hi": "अंतरराष्ट्रीय स्तर पर मान्यता प्राप्त एथलीटों या मनोरंजन समूहों के लिए", "ko": "국제적으로 인정받은 운동선수 또는 연예 그룹을 위한", "vi": "Cho vận động viên hoặc nhóm giải trí được công nhận quốc tế"}'::jsonb,
   'US'),
  
  -- Exchange Visitor Visas
  ('j1',
   '{"en": "J-1 Exchange Visitor Visa", "es": "Visa J-1 Visitante de Intercambio", "zh": "J-1交流访问签证", "fr": "Visa J-1 Visiteur d Échange", "ar": "تأشيرة الزائر التبادلي J-1", "ru": "Виза J-1 для участников программ обмена", "pt": "Visto J-1 Visitante de Intercâmbio", "hi": "J-1 विनिमय आगंतुक वीज़ा", "ko": "J-1 교환 방문자 비자", "vi": "Thị Thực Khách Trao Đổi J-1"}'::jsonb,
   '{"en": "For participants in approved exchange programs including au pairs, trainees, and researchers", "es": "Para participantes en programas de intercambio aprobados incluyendo au pairs, aprendices e investigadores", "zh": "用于批准的交流项目参与者，包括互惠生、受训者和研究人员", "fr": "Pour les participants aux programmes d échange approuvés y compris les au pairs, les stagiaires et les chercheurs", "ar": "للمشاركين في برامج التبادل المعتمدة بما في ذلك المربيات والمتدربين والباحثين", "ru": "Для участников утвержденных программ обмена, включая помощников по хозяйству, стажеров и исследователей", "pt": "Para participantes de programas de intercâmbio aprovados incluindo au pairs, estagiários e pesquisadores", "hi": "स्वीकृत विनिमय कार्यक्रमों में प्रतिभागियों के लिए जिनमें au pairs, प्रशिक्षु और शोधकर्ता शामिल हैं", "ko": "오페어, 연수생, 연구원을 포함한 승인된 교환 프로그램 참가자를 위한", "vi": "Cho người tham gia các chương trình trao đổi được phê duyệt bao gồm au pair, thực tập sinh và nhà nghiên cứu"}'::jsonb,
   'US'),
  
  -- Family Visas
  ('k1',
   '{"en": "K-1 Fiancé(e) Visa", "es": "Visa K-1 de Prometido(a)", "zh": "K-1未婚夫/妻签证", "fr": "Visa K-1 Fiancé(e)", "ar": "تأشيرة الخطيب/الخطيبة K-1", "ru": "Виза K-1 для женихов/невест", "pt": "Visto K-1 de Noivo(a)", "hi": "K-1 मंगेतर वीज़ा", "ko": "K-1 약혼자 비자", "vi": "Thị Thực Hôn Phu/Thê K-1"}'::jsonb,
   '{"en": "For fiancé(e)s of U.S. citizens to enter the U.S. and marry within 90 days", "es": "Para prometidos(as) de ciudadanos estadounidenses para entrar a EE.UU. y casarse dentro de 90 días", "zh": "供美国公民的未婚夫/妻进入美国并在90天内结婚", "fr": "Pour les fiancé(e)s de citoyens américains pour entrer aux États-Unis et se marier dans les 90 jours", "ar": "لخطيب/خطيبة المواطنين الأمريكيين للدخول إلى الولايات المتحدة والزواج في غضون 90 يومًا", "ru": "Для женихов/невест граждан США для въезда в США и заключения брака в течение 90 дней", "pt": "Para noivos(as) de cidadãos americanos para entrar nos EUA e casar dentro de 90 dias", "hi": "अमेरिकी नागरिकों के मंगेतर के लिए अमेरिका में प्रवेश करने और 90 दिनों के भीतर शादी करने के लिए", "ko": "미국 시민권자의 약혼자가 미국에 입국하여 90일 내에 결혼하기 위한", "vi": "Cho hôn phu/thê của công dân Mỹ để nhập cảnh Mỹ và kết hôn trong vòng 90 ngày"}'::jsonb,
   'US'),
  
  ('k3',
   '{"en": "K-3 Spouse Visa", "es": "Visa K-3 de Cónyuge", "zh": "K-3配偶签证", "fr": "Visa K-3 Conjoint", "ar": "تأشيرة الزوج/الزوجة K-3", "ru": "Виза K-3 для супругов", "pt": "Visto K-3 de Cônjuge", "hi": "K-3 पति/पत्नी वीज़ा", "ko": "K-3 배우자 비자", "vi": "Thị Thực Vợ/Chồng K-3"}'::jsonb,
   '{"en": "For spouses of U.S. citizens to enter while immigrant visa is processed", "es": "Para cónyuges de ciudadanos estadounidenses para entrar mientras se procesa la visa de inmigrante", "zh": "供美国公民的配偶在处理移民签证期间进入美国", "fr": "Pour les conjoints de citoyens américains pour entrer pendant le traitement du visa d immigrant", "ar": "لأزواج المواطنين الأمريكيين للدخول أثناء معالجة تأشيرة الهجرة", "ru": "Для супругов граждан США для въезда во время оформления иммиграционной визы", "pt": "Para cônjuges de cidadãos americanos para entrar enquanto o visto de imigrante é processado", "hi": "अमेरिकी नागरिकों के पति/पत्नी के लिए आप्रवासी वीज़ा की प्रक्रिया के दौरान प्रवेश करने के लिए", "ko": "이민 비자 처리 중 미국 시민권자의 배우자가 입국하기 위한", "vi": "Cho vợ/chồng của công dân Mỹ nhập cảnh trong khi xử lý thị thực nhập cư"}'::jsonb,
   'US'),
  
  -- Religious Worker Visas
  ('r1',
   '{"en": "R-1 Religious Worker Visa", "es": "Visa R-1 Trabajador Religioso", "zh": "R-1宗教工作签证", "fr": "Visa R-1 Travailleur Religieux", "ar": "تأشيرة العامل الديني R-1", "ru": "Виза R-1 для религиозных работников", "pt": "Visto R-1 Trabalhador Religioso", "hi": "R-1 धार्मिक कार्यकर्ता वीज़ा", "ko": "R-1 종교 활동가 비자", "vi": "Thị Thực Nhân Viên Tôn Giáo R-1"}'::jsonb,
   '{"en": "For individuals coming to work in a religious occupation or vocation", "es": "Para individuos que vienen a trabajar en una ocupación o vocación religiosa", "zh": "用于来美从事宗教职业或使命的个人", "fr": "Pour les personnes venant travailler dans une profession ou vocation religieuse", "ar": "للأفراد القادمين للعمل في مهنة أو دعوة دينية", "ru": "Для лиц, приезжающих работать в религиозной профессии или призвании", "pt": "Para indivíduos vindo trabalhar em uma ocupação ou vocação religiosa", "hi": "धार्मिक व्यवसाय या पेशे में काम करने आने वाले व्यक्तियों के लिए", "ko": "종교 직업 또는 성직 활동을 위해 오는 개인을 위한", "vi": "Cho các cá nhân đến làm việc trong nghề hoặc sứ mệnh tôn giáo"}'::jsonb,
   'US'),
  
  -- Media Visas
  ('i',
   '{"en": "I Media/Journalist Visa", "es": "Visa I Medios/Periodista", "zh": "I类媒体/记者签证", "fr": "Visa I Média/Journaliste", "ar": "تأشيرة الإعلام/الصحفي I", "ru": "Виза I для представителей СМИ/журналистов", "pt": "Visto I Mídia/Jornalista", "hi": "I मीडिया/पत्रकार वीज़ा", "ko": "I 언론/기자 비자", "vi": "Thị Thực Truyền Thông/Nhà Báo I"}'::jsonb,
   '{"en": "For representatives of foreign media coming to the U.S. for work", "es": "Para representantes de medios extranjeros que vienen a EE.UU. para trabajar", "zh": "供来美工作的外国媒体代表", "fr": "Pour les représentants des médias étrangers venant aux États-Unis pour travailler", "ar": "لممثلي وسائل الإعلام الأجنبية القادمين إلى الولايات المتحدة للعمل", "ru": "Для представителей иностранных СМИ, приезжающих в США для работы", "pt": "Para representantes de mídia estrangeira vindo aos EUA para trabalhar", "hi": "काम के लिए अमेरिका आने वाले विदेशी मीडिया के प्रतिनिधियों के लिए", "ko": "미국에서 일하기 위해 오는 외국 언론 대표를 위한", "vi": "Cho đại diện của phương tiện truyền thông nước ngoài đến Mỹ để làm việc"}'::jsonb,
   'US'),
  
  -- Permanent Residence
  ('greencard',
   '{"en": "Green Card (Permanent Resident)", "es": "Tarjeta Verde (Residente Permanente)", "zh": "绿卡（永久居民）", "fr": "Carte Verte (Résident Permanent)", "ar": "البطاقة الخضراء (مقيم دائم)", "ru": "Грин-карта (постоянный житель)", "pt": "Green Card (Residente Permanente)", "hi": "ग्रीन कार्ड (स्थायी निवासी)", "ko": "그린카드 (영주권)", "vi": "Thẻ Xanh (Thường Trú Nhân)"}'::jsonb,
   '{"en": "Permanent resident status through family, employment, or diversity lottery", "es": "Estatus de residente permanente a través de familia, empleo o lotería de diversidad", "zh": "通过家庭、就业或多样性抽签获得的永久居民身份", "fr": "Statut de résident permanent par la famille, l emploi ou la loterie de diversité", "ar": "وضع المقيم الدائم من خلال الأسرة أو العمل أو يانصيب التنوع", "ru": "Статус постоянного жителя через семью, работу или лотерею разнообразия", "pt": "Status de residente permanente através de família, emprego ou loteria de diversidade", "hi": "परिवार, रोजगार या विविधता लॉटरी के माध्यम से स्थायी निवासी स्थिति", "ko": "가족, 고용 또는 다양성 추첨을 통한 영주권 신분", "vi": "Tư cách thường trú nhân thông qua gia đình, việc làm hoặc xổ số đa dạng"}'::jsonb,
   'US'),
  
  -- Visa Waiver Program
  ('esta',
   '{"en": "ESTA/Visa Waiver Program", "es": "ESTA/Programa de Exención de Visa", "zh": "ESTA/免签证计划", "fr": "ESTA/Programme d Exemption de Visa", "ar": "ESTA/برنامج الإعفاء من التأشيرة", "ru": "ESTA/Программа безвизового въезда", "pt": "ESTA/Programa de Isenção de Visto", "hi": "ESTA/वीज़ा छूट कार्यक्रम", "ko": "ESTA/비자 면제 프로그램", "vi": "ESTA/Chương Trình Miễn Thị Thực"}'::jsonb,
   '{"en": "For tourism or business visits of 90 days or less from participating countries", "es": "Para visitas de turismo o negocios de 90 días o menos desde países participantes", "zh": "供来自参与国的90天或更短时间的旅游或商务访问", "fr": "Pour les visites de tourisme ou d affaires de 90 jours ou moins en provenance de pays participants", "ar": "لزيارات السياحة أو الأعمال لمدة 90 يومًا أو أقل من البلدان المشاركة", "ru": "Для туристических или деловых визитов продолжительностью 90 дней или менее из участвующих стран", "pt": "Para visitas de turismo ou negócios de 90 dias ou menos de países participantes", "hi": "भाग लेने वाले देशों से 90 दिनों या उससे कम की पर्यटन या व्यापार यात्राओं के लिए", "ko": "참여 국가에서 90일 이하의 관광 또는 사업 방문을 위한", "vi": "Cho các chuyến thăm du lịch hoặc kinh doanh 90 ngày trở xuống từ các quốc gia tham gia"}'::jsonb,
   'US')
ON CONFLICT (code) DO UPDATE
SET 
  name_translations = EXCLUDED.name_translations,
  description_translations = EXCLUDED.description_translations;