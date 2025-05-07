import { Request, Response } from "express";
import { News } from "../models/News";
import { User } from "../models/User";



export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const images = (req as any).files?.images || [];
    const files = (req as any).files?.files || [];

    const user = await User.findById(req.user._id);

    const news = new News({
      title,
      content,
      images: images.map((file: any) => file.filename),
      files: files.map((file: any) => file.filename),
      author: { _id: req.user._id, email: user?.email },
    });

    await news.save();
    res.status(201).json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(400).json({ error: "Error creating news" });
  }
};

export const getNews = async (req: Request, res: Response) => {
  try {
    const { title, author } = req.query;
    const query: any = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (author) {
      query.author = author;
    }

    const news = await News.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news" });
  }
};

export const getNewsById = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news" });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  try {

    const news = await News.findById(req.params.id)
    
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    const { title, content } = req.body;
    const images = (req as any).files?.images || [];
    const files = (req as any).files?.files || [];

    if (title) news.title = title;
    if (content) news.content = content;
    if (images.length > 0) {
      news.images = [
        ...news.images,
        ...images.map((file: any) => file.filename),
      ];
    }
    if (files.length > 0) {
      news.files = [...news.files, ...files.map((file: any) => file.filename)];
    }

    await news.save();
    res.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(400).json({ error: "Error updating news" });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const news = await News.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting news" });
  }
};

