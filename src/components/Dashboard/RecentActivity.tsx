
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { 
  BookOpen, Star, MessageSquare, User
} from 'lucide-react';

const RecentActivity: React.FC = () => {
  const { recentActivity } = useAppSelector(state => state.dashboard);

  // Function to get the appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <User className="h-4 w-4" />;
      case 'completion':
        return <BookOpen className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      case 'question':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Function to get the appropriate background color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'enrollment':
        return 'bg-blue-100 text-blue-600';
      case 'completion':
        return 'bg-green-100 text-green-600';
      case 'review':
        return 'bg-yellow-100 text-yellow-600';
      case 'question':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)} mr-3`}>
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <p className="text-sm font-medium">
                  <span className="font-semibold">{activity.studentName}</span>
                  {activity.type === 'enrollment' && ' enrolled in '}
                  {activity.type === 'completion' && ' completed '}
                  {activity.type === 'review' && ' reviewed '}
                  {activity.type === 'question' && ' asked a question in '}
                  <span className="font-medium">{activity.courseTitle}</span>
                </p>
                {activity.content && (
                  <p className="text-sm text-gray-500 mt-1">
                    {activity.type === 'review' && activity.rating && (
                      <span className="flex items-center text-yellow-500 mb-1">
                        {[...Array(activity.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </span>
                    )}
                    {activity.content}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No recent activity found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
