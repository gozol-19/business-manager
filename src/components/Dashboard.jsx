
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Package, Tag, TrendingUp } from 'lucide-react';
import { db } from '@/services/database';
import { motion } from 'framer-motion';

export function Dashboard() {
  const [stats, setStats] = useState({
    branches: 0,
    categories: 0,
    products: 0,
    totalValue: 0
  });

  useEffect(() => {
    const branches = db.getBranches();
    const categories = db.getCategories();
    const products = db.getProducts();
    const totalValue = products.reduce((sum, product) => sum + (product.price * 1), 0);

    setStats({
      branches: branches.length,
      categories: categories.length,
      products: products.length,
      totalValue
    });
  }, []);

  const statCards = [
    {
      title: 'Total Branches',
      value: stats.branches,
      icon: Building2,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: Tag,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Total Inventory Value',
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-white/70">Welcome to kosol business management system</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="gradient-text">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30">
                <h3 className="font-semibold text-white mb-2">Manage Branches</h3>
                <p className="text-white/70 text-sm">Add, edit, or remove branch locations</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30">
                <h3 className="font-semibold text-white mb-2">Organize Categories</h3>
                <p className="text-white/70 text-sm">Create and manage product categories</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                <h3 className="font-semibold text-white mb-2">Product Inventory</h3>
                <p className="text-white/70 text-sm">Track and manage your product catalog</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
