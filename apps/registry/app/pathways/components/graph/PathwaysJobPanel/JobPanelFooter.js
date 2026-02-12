import { useState, useRef, useEffect } from 'react';
import { Button } from '@repo/ui';
import {
  ExternalLink,
  Check,
  ChevronDown,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Send,
} from 'lucide-react';

const SENTIMENTS = [
  { value: 'dismissed', label: 'Quick dismiss', icon: Check },
  { value: 'not_interested', label: 'Not interested', icon: ThumbsDown },
  { value: 'interested', label: 'Interested', icon: ThumbsUp },
  { value: 'applied', label: 'Applied', icon: Send },
];

export function JobPanelFooter({
  selectedNode,
  jobInfo,
  isRead,
  onMarkAsRead,
  onClose,
  onPromptFeedback,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const hnUrl = `https://news.ycombinator.com/item?id=${selectedNode.id}`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-3 border-t bg-gray-50 flex items-center gap-2">
      <div className="relative flex-1" ref={dropdownRef}>
        <div className="flex">
          <Button
            variant={isRead ? 'secondary' : 'default'}
            size="sm"
            onClick={() => onMarkAsRead(selectedNode.id)}
            className="flex-1 rounded-r-none"
          >
            {isRead ? (
              <>
                <Check className="w-4 h-4 mr-1" /> Read
              </>
            ) : (
              'Mark as Read'
            )}
          </Button>
          <Button
            variant={isRead ? 'secondary' : 'default'}
            size="sm"
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-2 rounded-l-none border-l border-white/20"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {showDropdown && (
          <div className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {SENTIMENTS.map((sentiment) => {
              const Icon = sentiment.icon;
              return (
                <button
                  key={sentiment.value}
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    if (sentiment.value === 'dismissed') {
                      onMarkAsRead(selectedNode.id);
                    } else if (onPromptFeedback) {
                      onPromptFeedback(
                        {
                          id: selectedNode.id,
                          title: jobInfo.title,
                          company: jobInfo.company,
                        },
                        sentiment.value
                      );
                    }
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  {sentiment.label}
                  {sentiment.value !== 'dismissed' && (
                    <MessageSquare className="w-3 h-3 ml-auto text-gray-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Button variant="outline" size="sm" asChild className="flex-1">
        <a href={hnUrl} target="_blank" rel="noopener noreferrer">
          Apply on HN
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </Button>
    </div>
  );
}
