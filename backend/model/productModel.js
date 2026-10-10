import { DataTypes } from "sequelize";
import { sequelize, isDbConnected } from "../config/database.js";

let SqlProduct = null;
if (sequelize) {
  try {
    SqlProduct = sequelize.define("Product", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  } catch (err) {
    console.warn("[AI Studio] Failed to define Sequelize model:", err.message);
  }
}

// In-memory fallback dataset for AI Studio preview / offline DB
let mockProducts = [
  {
    id: 1,
    name: "Mechanical Keyboard RGB",
    price: 1890,
    description: "คีย์บอร์ดแมคคานิคอลไฟ RGB สวิตช์ Blue ทนทาน ตอบสนองไว เหมาะสำหรับเล่นเกมและทำงาน",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Wireless Gaming Mouse",
    price: 1250,
    description: "เมาส์เกมมิ่งไร้สาย เซนเซอร์ออปติคอลความแม่นยำสูง แบตเตอรี่อึด น้ำหนักเบา จับถนัดมือ",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Gaming Headset 7.1 Surround",
    price: 2190,
    description: "หูฟังเกมมิ่งระบบเสียงรอบทิศทาง 7.1 ไมโครโฟนตัดเสียงรบกวน ฟองน้ำระบายอากาศได้ดี",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
let nextId = 4;

function wrapMockItem(item) {
  if (!item) return null;
  return {
    ...item,
    toJSON() {
      return { ...item };
    },
    async update(updates) {
      Object.assign(item, updates);
      item.updatedAt = new Date().toISOString();
      Object.assign(this, item);
      return this;
    },
    async destroy() {
      mockProducts = mockProducts.filter((p) => String(p.id) !== String(item.id));
      return true;
    },
  };
}

const mockProductModel = {
  async create(data) {
    const newItem = {
      id: nextId++,
      name: data.name,
      price: Number(data.price),
      description: data.description || null,
      image: data.image || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newItem);
    return wrapMockItem(newItem);
  },
  async findAll() {
    return mockProducts.map(wrapMockItem);
  },
  async findByPk(id) {
    const found = mockProducts.find((p) => String(p.id) === String(id));
    return wrapMockItem(found);
  },
};

const Product = {
  create: async (data) => {
    if (isDbConnected && SqlProduct) {
      try {
        return await SqlProduct.create(data);
      } catch (err) {
        console.warn("[AI Studio] DB create failed, using mock store:", err.message);
      }
    }
    return mockProductModel.create(data);
  },
  findAll: async () => {
    if (isDbConnected && SqlProduct) {
      try {
        return await SqlProduct.findAll();
      } catch (err) {
        console.warn("[AI Studio] DB findAll failed, using mock store:", err.message);
      }
    }
    return mockProductModel.findAll();
  },
  findByPk: async (id) => {
    if (isDbConnected && SqlProduct) {
      try {
        const item = await SqlProduct.findByPk(id);
        if (item) return item;
      } catch (err) {
        console.warn("[AI Studio] DB findByPk failed, using mock store:", err.message);
      }
    }
    return mockProductModel.findByPk(id);
  },
};

export default Product;
