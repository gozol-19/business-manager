
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building2, Package, Tag, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Dashboard } from '@/components/Dashboard';
import { DataTable } from '@/components/DataTable';
import { BranchForm } from '@/components/BranchForm';
import { CategoryForm } from '@/components/CategoryForm';
import { ProductForm } from '@/components/ProductForm';
import { db } from '@/services/database';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState({
    branches: [],
    categories: [],
    products: []
  });
  const { toast } = useToast();

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setData({
      branches: db.getBranches(),
      categories: db.getCategories(),
      products: db.getProductsWithDetails()
    });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    try {
      let tableName = '';
      switch (activeTab) {
        case 'branches':
          tableName = 'branches';
          break;
        case 'categories':
          tableName = 'categories';
          break;
        case 'products':
          tableName = 'products';
          break;
        default:
          return;
      }
      
      db.delete(tableName, id);
      loadData();
      toast({
        title: 'Success',
        description: 'Item deleted successfully!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      });
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingItem(null);
    loadData();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'branches', label: 'Branches', icon: Building2 },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'products', label: 'Products', icon: Package }
  ];

  const getColumns = () => {
    switch (activeTab) {
      case 'branches':
        return [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { 
            key: 'logo', 
            label: 'Logo',
            render: (value) => value ? (
              <img src={value} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="text-gray-400">No logo</span>
            )
          }
        ];
      case 'categories':
        return [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' }
        ];
      case 'products':
        return [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
          { key: 'cost', label: 'Cost', render: (value) => `$${value.toFixed(2)}` },
          { key: 'price', label: 'Price', render: (value) => `$${value.toFixed(2)}` },
          { key: 'categoryName', label: 'Category' },
          { key: 'branchName', label: 'Branch' }
        ];
      default:
        return [];
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'branches':
        return data.branches;
      case 'categories':
        return data.categories;
      case 'products':
        return data.products;
      default:
        return [];
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'branches':
        return (
          <BranchForm
            branch={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case 'categories':
        return (
          <CategoryForm
            category={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case 'products':
        return (
          <ProductForm
            product={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      branches: 'Branches',
      categories: 'Categories',
      products: 'Products'
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <>
      <Helmet>
        <title>Business Management System - CRUD Operations</title>
        <meta name="description" content="Complete business management system with CRUD operations for branches, categories, and products" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-lg border-r border-white/20 z-40"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold gradient-text mb-8">Business Manager</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowForm(false);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="lg:ml-64 min-h-screen">
          <div className="p-6 pt-16 lg:pt-6">
            {showForm ? (
              renderForm()
            ) : activeTab === 'dashboard' ? (
              <Dashboard />
            ) : (
              <DataTable
                title={getTitle()}
                data={getCurrentData()}
                columns={getColumns()}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Toaster />
      </div>
    </>
  );
}

export default App;
