
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/services/database';
import { motion } from 'framer-motion';

export function CategoryForm({ category, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setFormData(category);
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: 'Error',
        description: 'Please enter a category name',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (category) {
        db.update('categories', category.id, formData);
        toast({
          title: 'Success',
          description: 'Category updated successfully!'
        });
      } else {
        db.create('categories', formData);
        toast({
          title: 'Success',
          description: 'Category created successfully!'
        });
      }
      onSave();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save category',
        variant: 'destructive'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="gradient-text">
            {category ? 'Edit Category' : 'Add New Category'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                {category ? 'Update' : 'Create'} Category
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
