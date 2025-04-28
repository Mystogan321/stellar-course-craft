
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
  addModule, 
  updateModule, 
  deleteModule,
  addLesson,
  updateLesson,
  deleteLesson,
  reorderModules,
  Module,
  Lesson
} from '@/store/slices/courseFormSlice';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadFile } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X, File, FileText, Video } from 'lucide-react';

const LessonDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  lesson?: Lesson;
  isEdit?: boolean;
}> = ({ isOpen, onClose, moduleId, lesson, isEdit = false }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(lesson?.title || '');
  const [type, setType] = useState<'video' | 'document' | 'notes'>(lesson?.type || 'video');
  const [content, setContent] = useState(lesson?.content || '');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a lesson title",
        variant: "destructive"
      });
      return;
    }

    let fileUrl = lesson?.fileUrl || '';
    let fileName = lesson?.fileName || '';
    
    if (file) {
      setIsUploading(true);
      try {
        const response = await uploadFile(file, type === 'video' ? 'video' : 'document');
        fileUrl = response.url;
        fileName = file.name;
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "There was an error uploading your file",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const lessonData: Lesson = {
      id: lesson?.id || uuidv4(),
      title,
      type,
      content,
      fileUrl,
      fileName,
    };
    
    if (isEdit && lesson) {
      dispatch(updateLesson({
        moduleId,
        lessonId: lesson.id,
        updates: lessonData
      }));
      toast({ title: "Lesson updated" });
    } else {
      dispatch(addLesson({ moduleId, lesson: lessonData }));
      toast({ title: "Lesson added" });
    }
    
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (type === 'video' && !selectedFile.type.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file for video lessons",
          variant: "destructive"
        });
        return;
      }
      if (type === 'document' && !['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or PPTX file for documents",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="lesson-title">Lesson Title</Label>
            <Input 
              id="lesson-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Introduction to React Hooks"
            />
          </div>
          
          <div>
            <Label htmlFor="lesson-type">Lesson Type</Label>
            <Select 
              value={type} 
              onValueChange={(value: 'video' | 'document' | 'notes') => setType(value)}
              disabled={isEdit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lesson type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {type === 'notes' ? (
            <div>
              <Label htmlFor="lesson-notes">Content</Label>
              <div className="mt-1">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  placeholder="Write your lesson content here..."
                />
              </div>
            </div>
          ) : (
            <div>
              <Label>Upload {type === 'video' ? 'Video' : 'Document'}</Label>
              <div className="mt-1">
                {file || lesson?.fileName ? (
                  <div className="flex items-center p-3 bg-gray-100 rounded">
                    {type === 'video' ? <Video className="mr-2" /> : <File className="mr-2" />}
                    <span className="flex-1 truncate">{file?.name || lesson?.fileName}</span>
                    <button 
                      type="button"
                      onClick={() => setFile(null)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="file-input-wrapper w-full">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-stellar-accent">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stellar-accent"></div>
                          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          {type === 'video' ? <Video className="mx-auto h-8 w-8 text-gray-400" /> : <File className="mx-auto h-8 w-8 text-gray-400" />}
                          <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">
                            {type === 'video' ? 'MP4 or MOV up to 2GB' : 'PDF, DOCX, PPTX up to 100MB'}
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        accept={type === 'video' ? 'video/*' : '.pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation'}
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? 'Uploading...' : isEdit ? 'Update Lesson' : 'Add Lesson'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CurriculumBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector(state => state.courseForm.modules);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [editModuleId, setEditModuleId] = useState<string | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState('');
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>(undefined);
  const [isEditLesson, setIsEditLesson] = useState(false);

  const handleAddModule = () => {
    if (!newModuleTitle) {
      toast({
        title: "Title required",
        description: "Please enter a module title",
        variant: "destructive"
      });
      return;
    }
    
    const newModule: Module = {
      id: uuidv4(),
      title: newModuleTitle,
      lessons: [],
    };
    
    dispatch(addModule(newModule));
    setNewModuleTitle('');
    
    toast({
      title: "Module added",
      description: `Module "${newModuleTitle}" has been added.`
    });
  };

  const handleStartEditModule = (module: Module) => {
    setEditModuleId(module.id);
    setEditModuleTitle(module.title);
  };

  const handleConfirmEditModule = () => {
    if (!editModuleId || !editModuleTitle) return;
    
    dispatch(updateModule({
      moduleId: editModuleId,
      title: editModuleTitle
    }));
    
    setEditModuleId(null);
    setEditModuleTitle('');
  };

  const handleOpenAddLesson = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentLesson(undefined);
    setIsEditLesson(false);
    setLessonDialogOpen(true);
  };

  const handleOpenEditLesson = (moduleId: string, lesson: Lesson) => {
    setCurrentModuleId(moduleId);
    setCurrentLesson(lesson);
    setIsEditLesson(true);
    setLessonDialogOpen(true);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm("Are you sure you want to delete this module and all its lessons? This action cannot be undone.")) {
      dispatch(deleteModule(moduleId));
      toast({
        title: "Module deleted",
        description: "The module and all its lessons have been deleted."
      });
    }
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
      dispatch(deleteLesson({ moduleId, lessonId }));
      toast({
        title: "Lesson deleted",
        description: "The lesson has been deleted."
      });
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <File className="h-5 w-5 text-green-500" />;
      case 'notes':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="new-module">New Module</Label>
          <Input
            id="new-module"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="e.g., Getting Started with React"
            className="mt-1"
          />
        </div>
        <Button onClick={handleAddModule} className="mb-0">Add Module</Button>
      </div>
      
      {modules.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-md">
          <h3 className="text-lg font-medium text-gray-500">No Modules Yet</h3>
          <p className="text-gray-400">Add your first module to start building your curriculum</p>
        </div>
      ) : (
        <Accordion type="multiple" className="w-full">
          {modules.map((module) => (
            <AccordionItem key={module.id} value={module.id} className="border rounded-lg mb-4 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
                {editModuleId === module.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editModuleTitle}
                      onChange={(e) => setEditModuleTitle(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleConfirmEditModule}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditModuleId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <AccordionTrigger className="hover:no-underline py-2 px-1">
                    <span className="font-medium text-left">{module.title}</span>
                  </AccordionTrigger>
                )}
                
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleOpenAddLesson(module.id)}
                  >
                    Add Lesson
                  </Button>
                  
                  {editModuleId !== module.id && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEditModule(module);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module.id);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <AccordionContent>
                {module.lessons.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No lessons yet. Click "Add Lesson" to create your first lesson in this module.
                  </div>
                ) : (
                  <ul className="divide-y">
                    {module.lessons.map((lesson, index) => (
                      <li key={lesson.id} className="py-3 px-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <span className="text-xs text-gray-500 capitalize">{lesson.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenEditLesson(module.id, lesson)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteLesson(module.id, lesson.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      
      {lessonDialogOpen && currentModuleId && (
        <LessonDialog
          isOpen={lessonDialogOpen}
          onClose={() => setLessonDialogOpen(false)}
          moduleId={currentModuleId}
          lesson={currentLesson}
          isEdit={isEditLesson}
        />
      )}
    </div>
  );
};

export default CurriculumBuilder;
