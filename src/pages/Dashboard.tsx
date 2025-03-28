
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Heart, BookOpen, Target, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for the mood chart
const mockMoodData = [
  { day: 'Mon', mood: 3 },
  { day: 'Tue', mood: 4 },
  { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 5 },
  { day: 'Fri', mood: 3 },
  { day: 'Sat', mood: 4 },
  { day: 'Sun', mood: 5 },
];

// Mock journal entries
const mockJournalEntries = [
  {
    id: 1,
    date: 'June 15, 2023',
    mood: 'Happy',
    content: 'Today was a great day. I accomplished all my tasks and spent quality time with family.',
    triggers: ['Success at work', 'Family time'],
  },
  {
    id: 2,
    date: 'June 14, 2023',
    mood: 'Anxious',
    content: 'Feeling nervous about the upcoming presentation. Need to prepare better.',
    triggers: ['Work pressure', 'Public speaking'],
  },
];

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold header-gradient mb-4 md:mb-0">MindTrack Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" size="sm">Demo Mode</Button>
          <Button className="btn-primary" size="sm">Sign In</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Track Your Journey</CardTitle>
            <CardDescription>Monitor your mental well-being</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Quick Access</h3>
                <ul className="space-y-1">
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <Brain className="mr-2 h-4 w-4" />
                      <span>Mood Tracker</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Journal</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Gratitude</span>
                    </Button>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start">
                      <Target className="mr-2 h-4 w-4" />
                      <span>Goals</span>
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Mood Trends</CardTitle>
                  <CardDescription>Track how you've been feeling</CardDescription>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">This Week</span>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockMoodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1 - Very Low</span>
                <span>2 - Low</span>
                <span>3 - Neutral</span>
                <span>4 - Good</span>
                <span>5 - Excellent</span>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="journal">
            <TabsList className="w-full">
              <TabsTrigger value="journal" className="flex-1">Journal</TabsTrigger>
              <TabsTrigger value="gratitude" className="flex-1">Gratitude</TabsTrigger>
              <TabsTrigger value="triggers" className="flex-1">Triggers</TabsTrigger>
              <TabsTrigger value="goals" className="flex-1">Goals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="journal" className="space-y-4 mt-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Your Journal Entries</h3>
                <Button className="btn-secondary" size="sm">New Entry</Button>
              </div>
              
              {mockJournalEntries.map((entry) => (
                <Card key={entry.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{entry.date}</CardTitle>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        entry.mood === 'Happy' ? 'bg-green-100 text-green-800' : 
                        entry.mood === 'Anxious' ? 'bg-amber-100 text-amber-800' : ''
                      }`}>
                        {entry.mood}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{entry.content}</p>
                    <div className="flex gap-2 mt-3">
                      {entry.triggers.map((trigger, i) => (
                        <span key={i} className="text-xs bg-accent/30 px-2 py-1 rounded">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="gratitude" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gratitude Journal</CardTitle>
                  <CardDescription>Record things you're grateful for</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Sign in to access your gratitude journal
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="triggers" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emotional Triggers</CardTitle>
                  <CardDescription>Identify patterns in what affects your mood</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Sign in to track your emotional triggers
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Goals</CardTitle>
                  <CardDescription>Set and track goals for your mental well-being</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Sign in to manage your personal growth goals
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Personalized insights based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm italic text-muted-foreground">
                  "Based on your recent mood patterns, you seem to experience higher moods on weekends.
                  Consider activities that bring you joy during weekdays to maintain more balanced emotions."
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Note: This is a demo insight. Sign in to receive personalized insights based on your actual data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
