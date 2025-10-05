import { useEffect, useState } from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  url: string;
  published_at: string;
  category: 'urgent' | 'update' | 'info';
}

interface NewsHeadlineProps {
  t: (key: string) => string;
}

export function NewsHeadline({ t }: NewsHeadlineProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        headline: 'USCIS Announces Extended Processing Times for Work Authorization',
        url: 'https://www.uscis.gov',
        published_at: '2 hours ago',
        category: 'urgent'
      },
      {
        id: '2',
        headline: 'New Policy Updates for International Student Visas',
        url: 'https://www.uscis.gov',
        published_at: '5 hours ago',
        category: 'update'
      },
      {
        id: '3',
        headline: 'Immigration Services Offices Resume Normal Hours',
        url: 'https://www.uscis.gov',
        published_at: '1 day ago',
        category: 'info'
      }
    ];
    setNewsItems(mockNews);
  }, []);

  if (newsItems.length === 0) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'update':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'update':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          {t('top_stories')}
        </h3>
      </div>

      <div className="space-y-2">
        {newsItems.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-start gap-3 p-3 rounded-md border transition-all hover:shadow-md ${getCategoryColor(item.category)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getCategoryIcon(item.category)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {item.headline}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.published_at}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
