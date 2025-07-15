
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function DataTable({ title, data, columns, onAdd, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-effect border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="gradient-text">{title}</CardTitle>
          <Button 
            onClick={onAdd}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/5">
                  {columns.map((column) => (
                    <TableHead key={column.key} className="text-white font-semibold">
                      {column.label}
                    </TableHead>
                  ))}
                  <TableHead className="text-white font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center text-gray-400 py-8">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      {columns.map((column) => (
                        <TableCell key={column.key} className="text-white">
                          {column.render ? column.render(item[column.key], item) : item[column.key]}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(item)}
                            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(item.id)}
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
