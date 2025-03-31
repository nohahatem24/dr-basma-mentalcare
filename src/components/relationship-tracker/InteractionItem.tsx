
import React from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/components/Header';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Interaction, InteractionType } from './useRelationshipInteractions';

interface InteractionItemProps {
  interaction: Interaction;
}

export function InteractionItem({ interaction }: InteractionItemProps) {
  const { language } = useLanguage();
  
  const getInteractionColor = (type: InteractionType) => {
    switch(type) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getInteractionIcon = (type: InteractionType) => {
    switch(type) {
      case 'positive': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <Card key={interaction.id} className="overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {getInteractionIcon(interaction.type)}
            <span className={`text-xs px-2 py-1 rounded-full ${getInteractionColor(interaction.type)}`}>
              {interaction.type === 'positive' 
                ? (language === 'en' ? 'Positive' : 'إيجابي')
                : interaction.type === 'negative'
                  ? (language === 'en' ? 'Negative' : 'سلبي')
                  : (language === 'en' ? 'Neutral' : 'محايد')}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(interaction.date).toLocaleDateString()}
          </span>
        </div>
        
        <p className="text-sm font-medium mb-2">{interaction.description}</p>
        
        {interaction.reflection && (
          <div className="bg-muted/40 p-2 rounded text-sm">
            <p className="text-xs font-medium mb-1">
              {language === 'en' ? 'Reflection' : 'تأمل'}
            </p>
            <p className="text-muted-foreground">{interaction.reflection}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
