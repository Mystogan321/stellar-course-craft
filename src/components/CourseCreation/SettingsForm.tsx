
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  updateBasicInfo,
  addLearningObjective,
  updateLearningObjective,
  deleteLearningObjective
} from '@/store/slices/courseFormSlice';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

const SettingsForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    slug,
    metaTitle,
    metaDescription,
    learningObjectives,
    targetAudience,
    prerequisites,
    certificateEnabled,
    dripEnabled,
    dripInterval,
    title
  } = useAppSelector(state => state.courseForm);
  
  const [newObjective, setNewObjective] = React.useState('');

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateBasicInfo({ [name]: value }));
  };

  const handleToggleChange = (name: string) => (checked: boolean) => {
    dispatch(updateBasicInfo({ [name]: checked }));
  };

  const handleDripIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    dispatch(updateBasicInfo({ dripInterval: Math.max(1, value) }));
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      dispatch(addLearningObjective(newObjective.trim()));
      setNewObjective('');
    }
  };

  const handleObjectiveKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddObjective();
    }
  };

  const handleUpdateObjective = (index: number, value: string) => {
    dispatch(updateLearningObjective({ index, value }));
  };

  const handleDeleteObjective = (index: number) => {
    dispatch(deleteLearningObjective(index));
  };

  // Auto-generate slug from title if slug is empty
  React.useEffect(() => {
    if (!slug && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      dispatch(updateBasicInfo({ slug: generatedSlug }));
    }
  }, [title, slug, dispatch]);

  return (
    <Tabs defaultValue="seo">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="learning">Learning Objectives</TabsTrigger>
        <TabsTrigger value="audience">Target Audience</TabsTrigger>
        <TabsTrigger value="settings">Course Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="seo" className="space-y-6">
        <div>
          <Label htmlFor="slug" className="text-base font-semibold">Course URL Slug</Label>
          <div className="flex items-center mt-1">
            <span className="text-gray-500 bg-gray-100 px-3 py-2 rounded-l-md border border-r-0">
              yoursite.com/courses/
            </span>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={handleSettingsChange}
              placeholder="your-course-slug"
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Use lowercase letters, numbers, and hyphens only. No spaces.</p>
        </div>
        
        <div>
          <Label htmlFor="metaTitle" className="text-base font-semibold">Meta Title</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            value={metaTitle}
            onChange={handleSettingsChange}
            placeholder="SEO title for search engines"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
        </div>
        
        <div>
          <Label htmlFor="metaDescription" className="text-base font-semibold">Meta Description</Label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            value={metaDescription}
            onChange={handleSettingsChange}
            placeholder="Brief description for search results"
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
        </div>
      </TabsContent>
      
      <TabsContent value="learning" className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base font-semibold">Learning Objectives</Label>
            <span className="text-sm text-gray-500">{learningObjectives.length} objectives</span>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Input
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="e.g., Master React Hooks and Context API"
              onKeyDown={handleObjectiveKeyDown}
            />
            <Button type="button" onClick={handleAddObjective}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          {learningObjectives.length > 0 ? (
            <ul className="space-y-2">
              {learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-stellar-accent text-white rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <Input
                    value={objective}
                    onChange={(e) => handleUpdateObjective(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteObjective(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">Add learning objectives to help students understand what they'll learn</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="audience" className="space-y-6">
        <div>
          <Label htmlFor="targetAudience" className="text-base font-semibold">Target Audience</Label>
          <p className="text-sm text-gray-500 mb-2">Describe who this course is for</p>
          <Textarea
            id="targetAudience"
            name="targetAudience"
            value={targetAudience}
            onChange={handleSettingsChange}
            placeholder="e.g., This course is designed for beginner web developers who want to learn React..."
            rows={4}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="prerequisites" className="text-base font-semibold">Prerequisites</Label>
          <p className="text-sm text-gray-500 mb-2">What should students know before taking this course?</p>
          <Textarea
            id="prerequisites"
            name="prerequisites"
            value={prerequisites}
            onChange={handleSettingsChange}
            placeholder="e.g., Basic knowledge of HTML, CSS, and JavaScript is required..."
            rows={4}
            className="mt-1"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="certificateEnabled" className="text-base font-semibold">Certificate of Completion</Label>
            <p className="text-sm text-gray-500">Enable to award certificates when students complete the course</p>
          </div>
          <Switch
            id="certificateEnabled"
            checked={certificateEnabled}
            onCheckedChange={handleToggleChange('certificateEnabled')}
          />
        </div>
        
        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dripEnabled" className="text-base font-semibold">Drip Content</Label>
              <p className="text-sm text-gray-500">Release course content gradually over time</p>
            </div>
            <Switch
              id="dripEnabled"
              checked={dripEnabled}
              onCheckedChange={handleToggleChange('dripEnabled')}
            />
          </div>
          
          {dripEnabled && (
            <div className="mt-4">
              <Label htmlFor="dripInterval" className="text-sm font-medium">Days Between Content Release</Label>
              <Input
                id="dripInterval"
                type="number"
                min="1"
                value={dripInterval}
                onChange={handleDripIntervalChange}
                className="mt-1 w-24"
              />
              <p className="text-xs text-gray-500 mt-1">
                New modules will be released every {dripInterval} day{dripInterval !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SettingsForm;
