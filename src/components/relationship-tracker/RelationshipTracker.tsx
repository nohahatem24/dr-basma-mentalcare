
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/Header';
import { Heart, Plus } from 'lucide-react';
import { useRelationshipInteractions } from './useRelationshipInteractions';
import { InteractionForm } from './InteractionForm';
import { InteractionsList } from './InteractionsList';

const RelationshipTracker = () => {
  const { language } = useLanguage();
  const { 
    interactions, 
    isAdding, 
    setIsAdding, 
    handleAddInteraction 
  } = useRelationshipInteractions();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Relationship Tracker' : 'متتبع العلاقات'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Track and reflect on your relationship interactions'
            : 'تتبع وتأمل في تفاعلات علاقتك'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding ? (
          <InteractionForm 
            onSubmit={handleAddInteraction} 
            onCancel={() => setIsAdding(false)} 
          />
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {language === 'en' ? 'Add New Interaction' : 'إضافة تفاعل جديد'}
          </Button>
        )}
        
        <InteractionsList interactions={interactions} />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          {language === 'en' ? 'View All Interactions' : 'عرض جميع التفاعلات'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RelationshipTracker;
