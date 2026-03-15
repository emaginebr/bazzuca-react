import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useClients } from '../hooks/useClients';
import { useSocialNetworks } from '../hooks/useSocialNetworks';
import type { PostInfo, PostInput, PostTypeEnum, PostStatusEnum } from '../types/bazzuca';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ACCEPTED_FILE_TYPES = 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm';

function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.includes('video');
}

export interface PostEditorProps {
  postId?: number;
  initialData?: Partial<PostInput>;
  onSave?: (post: PostInfo) => void;
  onCancel?: () => void;
  onUploadMedia?: (file: File) => Promise<string | undefined>;
  className?: string;
}

const POST_TYPES = [
  { value: 1, label: 'Post' },
  { value: 2, label: 'Story' },
  { value: 3, label: 'Reel' },
];

const POST_STATUSES = [
  { value: 1, label: 'Draft' },
  { value: 2, label: 'Scheduled' },
  { value: 3, label: 'Scheduled on Network' },
  { value: 4, label: 'Posted' },
  { value: 5, label: 'Canceled' },
];

export function PostEditor({
  postId,
  initialData,
  onSave,
  onCancel,
  onUploadMedia,
  className,
}: PostEditorProps) {
  const { getPostById, createPost, updatePost } = usePosts(undefined, undefined, false);
  const { clients } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(initialData?.clientId);
  const { networks } = useSocialNetworks(selectedClientId || 0, !!selectedClientId);

  const [formData, setFormData] = useState<Partial<PostInput>>({
    title: '',
    description: '',
    mediaUrl: '',
    scheduleDate: new Date().toISOString().slice(0, 16),
    postType: 1 as PostTypeEnum,
    status: 1 as PostStatusEnum,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingPost, setExistingPost] = useState<PostInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!onUploadMedia) return;

    setUploading(true);
    setError(null);
    try {
      const url = await onUploadMedia(file);
      if (url) {
        setFormData((prev) => ({ ...prev, mediaUrl: url }));
      } else {
        setError('Failed to upload media. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onUploadMedia]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so the same file can be selected again
    e.target.value = '';
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleClearMedia = useCallback(() => {
    setFormData((prev) => ({ ...prev, mediaUrl: '' }));
  }, []);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    if (!postId) return;
    
    setLoading(true);
    const post = await getPostById(postId);
    setLoading(false);

    if (post) {
      setExistingPost(post);
      setSelectedClientId(post.clientId);
      setFormData({
        clientId: post.clientId,
        networkId: post.networkId,
        title: post.title,
        description: post.description,
        mediaUrl: post.mediaUrl,
        scheduleDate: post.scheduleDate.slice(0, 16),
        postType: post.postType,
        status: post.status,
      });
    }
  };

  const handleChange = (field: keyof PostInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClientChange = (clientId: string) => {
    const id = Number(clientId);
    setSelectedClientId(id);
    setFormData((prev) => ({ ...prev, clientId: id, networkId: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.clientId) {
      setError('Client is required');
      return;
    }

    if (!formData.networkId) {
      setError('Social network is required');
      return;
    }

    if (!formData.scheduleDate) {
      setError('Schedule date is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const postData: PostInput = {
        clientId: formData.clientId!,
        networkId: formData.networkId!,
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        mediaUrl: formData.mediaUrl?.trim() || '',
        scheduleDate: new Date(formData.scheduleDate).toISOString(),
        postType: formData.postType || 1,
        status: formData.status || 1,
      };

      let result: PostInfo | undefined;

      if (postId && existingPost) {
        result = await updatePost({
          postId,
          ...postData,
        });
      } else {
        result = await createPost(postData);
      }

      if (result) {
        onSave?.(result);
      } else {
        setError('Failed to save post. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{postId ? 'Edit Post' : 'Create New Post'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <select
                id="client"
                value={formData.clientId?.toString() || ''}
                onChange={(e) => handleClientChange(e.target.value)}
                disabled={loading}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.clientId} value={client.clientId.toString()}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network">Social Network</Label>
              <select
                id="network"
                value={formData.networkId?.toString() || ''}
                onChange={(e) => handleChange('networkId', e.target.value ? Number(e.target.value) : undefined)}
                disabled={loading || !selectedClientId}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a network</option>
                {networks.map((network) => (
                  <option key={network.networkId} value={network.networkId.toString()}>
                    {network.user} ({network.url})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter post title"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter post description"
              disabled={loading}
              rows={5}
              className="flex w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-3">
            <Label>Media</Label>

            {/* Upload drop zone — only shown when onUploadMedia is provided */}
            {onUploadMedia && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploading && !loading && fileInputRef.current?.click()}
                className={`
                  relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors
                  ${isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }
                  ${(uploading || loading) ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {uploading ? (
                  <>
                    <svg className="h-8 w-8 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Click to upload or drag & drop
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      JPG, PNG, GIF, WebP, MP4, WebM
                    </span>
                  </>
                )}
              </div>
            )}

            {/* URL input — always visible */}
            <div className="space-y-1">
              <Label htmlFor="mediaUrl" className="text-xs text-gray-500 dark:text-gray-400">
                {onUploadMedia ? 'Or enter a URL directly' : 'Media URL'}
              </Label>
              <Input
                id="mediaUrl"
                type="url"
                value={formData.mediaUrl}
                onChange={(e) => handleChange('mediaUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={loading || uploading}
              />
            </div>

            {/* Preview + clear button */}
            {formData.mediaUrl && (
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={handleClearMedia}
                  className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 transition-colors shadow-sm"
                  title="Remove media"
                >
                  ✕
                </button>
                {isVideoUrl(formData.mediaUrl) ? (
                  <video
                    src={formData.mediaUrl}
                    controls
                    className="max-w-xs max-h-48 rounded-md border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <img
                    src={formData.mediaUrl}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded-md border border-gray-200 dark:border-gray-700 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleDate">Schedule Date & Time</Label>
              <Input
                id="scheduleDate"
                type="datetime-local"
                value={formData.scheduleDate}
                onChange={(e) => handleChange('scheduleDate', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postType">Post Type</Label>
              <select
                id="postType"
                value={formData.postType?.toString()}
                onChange={(e) => handleChange('postType', Number(e.target.value))}
                disabled={loading}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {POST_TYPES.map((type) => (
                  <option key={type.value} value={type.value.toString()}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status?.toString()}
                onChange={(e) => handleChange('status', Number(e.target.value))}
                disabled={loading}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {POST_STATUSES.map((status) => (
                  <option key={status.value} value={status.value.toString()}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-4">
            <Button type="submit" disabled={loading || uploading}>
              {loading ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading || uploading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
