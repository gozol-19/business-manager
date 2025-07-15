
class FakeDatabase {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem('branches')) {
      localStorage.setItem('branches', JSON.stringify([
        { id: 1, name: 'Main Branch', email: 'main@company.com', phone: '+1234567890', logo: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Downtown Branch', email: 'downtown@company.com', phone: '+1234567891', logo: 'https://via.placeholder.com/100' }
      ]));
    }

    if (!localStorage.getItem('categories')) {
      localStorage.setItem('categories', JSON.stringify([
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Clothing' },
        { id: 3, name: 'Books' }
      ]));
    }

    if (!localStorage.getItem('products')) {
      localStorage.setItem('products', JSON.stringify([
        { id: 1, name: 'Laptop', cost: 800.00, price: 1200.00, categoryId: 1, branchId: 1 },
        { id: 2, name: 'T-Shirt', cost: 10.00, price: 25.00, categoryId: 2, branchId: 1 },
        { id: 3, name: 'Novel', cost: 5.00, price: 15.00, categoryId: 3, branchId: 2 }
      ]));
    }
  }

  getNextId(tableName) {
    const data = this.getAll(tableName);
    return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
  }

  getAll(tableName) {
    try {
      const data = localStorage.getItem(tableName);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error getting ${tableName}:`, error);
      return [];
    }
  }

  getById(tableName, id) {
    const data = this.getAll(tableName);
    return data.find(item => item.id === parseInt(id));
  }

  create(tableName, item) {
    try {
      const data = this.getAll(tableName);
      const newItem = { ...item, id: this.getNextId(tableName) };
      data.push(newItem);
      localStorage.setItem(tableName, JSON.stringify(data));
      return newItem;
    } catch (error) {
      console.error(`Error creating ${tableName}:`, error);
      throw error;
    }
  }

  update(tableName, id, updatedItem) {
    try {
      const data = this.getAll(tableName);
      const index = data.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        data[index] = { ...updatedItem, id: parseInt(id) };
        localStorage.setItem(tableName, JSON.stringify(data));
        return data[index];
      }
      throw new Error(`Item with id ${id} not found`);
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }
  }

  delete(tableName, id) {
    try {
      const data = this.getAll(tableName);
      const filteredData = data.filter(item => item.id !== parseInt(id));
      localStorage.setItem(tableName, JSON.stringify(filteredData));
      return true;
    } catch (error) {
      console.error(`Error deleting ${tableName}:`, error);
      throw error;
    }
  }

  // Specific methods for each table
  getBranches() {
    return this.getAll('branches');
  }

  getCategories() {
    return this.getAll('categories');
  }

  getProducts() {
    return this.getAll('products');
  }

  getProductsWithDetails() {
    const products = this.getProducts();
    const branches = this.getBranches();
    const categories = this.getCategories();

    return products.map(product => ({
      ...product,
      branchName: branches.find(b => b.id === product.branchId)?.name || 'Unknown',
      categoryName: categories.find(c => c.id === product.categoryId)?.name || 'Unknown'
    }));
  }
}

export const db = new FakeDatabase();
