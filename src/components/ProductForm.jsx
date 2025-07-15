
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/services/database';
import { motion } from 'framer-motion';

export function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    price: '',
    categoryId: '',
    branchId: ''
  });
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    setCategories(db.getCategories());
    setBranches(db.getBranches());
    
    if (product) {
      setFormData({
        ...product,
        categoryId: product.categoryId.toString(),
        branchId: product.branchId.toString()
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cost || !formData.price || !formData.categoryId || !formData.branchId) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    const productData = {
      ...formData,
      cost: parseFloat(formData.cost),
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
      branchId: parseInt(formData.branchId)
    };

    try {
      if (product) {
        db.update('products', product.id, productData);
        toast({
          title: 'Success',
          description: 'Product updated successfully!'
        });
      } else {
        db.create('products', productData);
        toast({
          title: 'Success',
          description: 'Product created successfully!'
        });
      }
      onSave();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
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

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
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
            {product ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cost">Cost *</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label>Category *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange('categoryId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Branch *</Label>
              <Select value={formData.branchId} onValueChange={(value) => handleSelectChange('branchId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                {product ? 'Update' : 'Create'} Product
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
