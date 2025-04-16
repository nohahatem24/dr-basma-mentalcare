
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/Header';
import { getMoodLabel, getMoodColor, formatDate } from './MoodUtils';

interface MoodEntryCardProps {
  entry: {
    id: string;
    date: Date;
    mood: number;
    notes: string;
    triggers: string[];
  };
  onEdit: (entry: any) => void;
  onDelete: (id: string) => void;
}

export const MoodEntryCard: React.FC<MoodEntryCardProps> = ({
  entry,
  onEdit,
  onDelete,
}) => {
  const { language } = useLanguage();

  return (
    <Card key={entry.id} className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm px-2 py-1 rounded-full ${getMoodColor(entry.mood)}`}>
                {entry.mood} - {getMoodLabel(entry.mood, language)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(new Date(entry.date), language)}
            </p>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(entry)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(entry.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {entry.notes && (
          <p className="text-sm mt-2">{entry.notes}</p>
        )}

        {entry.triggers.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {entry.triggers.map((trigger, index) => (
              <span
                key={index}
                className="bg-muted/50 px-2 py-0.5 rounded-full text-xs"
              >
                {trigger}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
