
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateBasicInfo, updateTags } from '@/store/slices/courseFormSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { getCategories } from '@/services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BasicInfoForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { title, subtitle, description, category, level, language, tags } = useAppSelector(state => state.courseForm);
  const [categories, setCategories] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateBasicInfo({ [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    dispatch(updateBasicInfo({ description: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    dispatch(updateBasicInfo({ [name]: value }));
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const newTags = [...tags, tagInput];
      dispatch(updateTags(newTags));
      setTagInput('');
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    dispatch(updateTags(newTags));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-base font-semibold">Course Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={handleBasicInfoChange}
          placeholder="e.g., The Complete Web Development Bootcamp"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="subtitle" className="text-base font-semibold">Course Subtitle</Label>
        <Input
          id="subtitle"
          name="subtitle"
          value={subtitle}
          onChange={handleBasicInfoChange}
          placeholder="e.g., Learn HTML, CSS, JavaScript, React, Node.js, and more"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="text-base font-semibold">Course Description</Label>
        <div className="mt-1">
          <ReactQuill
            theme="snow"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Provide a detailed description of your course..."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category" className="text-base font-semibold">Category</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('category', value)} 
            value={category}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="level" className="text-base font-semibold">Level</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('level', value)} 
            value={level}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="language" className="text-base font-semibold">Language</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('language', value)} 
            value={language}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Mandarin">Mandarin</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
              <SelectItem value="Korean">Korean</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Arabic">Arabic</SelectItem>
              <SelectItem value="Portuguese">Portuguese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="tags" className="text-base font-semibold">Tags (Skills)</Label>
          <div className="flex mt-1">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="e.g., JavaScript, React"
              className="flex-1"
            />
            <button 
              type="button"
              onClick={addTag}
              className="ml-2 px-4 py-2 bg-stellar-accent text-white rounded-md"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} className="bg-stellar-accent text-white flex items-center">
                {tag}
                <button 
                  type="button" 
                  onClick={() => removeTag(tag)}
                  className="ml-1 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
