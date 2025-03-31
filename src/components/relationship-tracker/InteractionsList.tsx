
import React from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/components/Header';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Interaction, InteractionType } from './useRelationshipInteractions';
import { InteractionItem } from './InteractionItem';

interface InteractionsListProps {
  interactions: Interaction[];
}

export function InteractionsList({ interactions }: InteractionsListProps) {
  const { language } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="font-medium">
        {language === 'en' ? 'Recent Interactions' : 'التفاعلات الأخيرة'}
      </h3>
      
      {interactions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {language === 'en' 
            ? 'No interactions recorded yet. Add your first one!'
            : 'لم يتم تسجيل أي تفاعلات حتى الآن. أضف أول واحد!'}
        </p>
      ) : (
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <InteractionItem 
              key={interaction.id} 
              interaction={interaction} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
