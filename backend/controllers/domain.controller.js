const Domain = require("../models/domain.model");
const User = require("../models/user.model");
const { validateEmail } = require("../utils/validateForm");
const cloudinary = require("cloudinary").v2;

exports.createDomain = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, password, tags, description } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        message: "Incomplete details provided",
      });

    if (!validateEmail(email))
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });

    const isUser = await User.findById(id);
    if (!isUser)
      return res.status(400).json({
        success: false,
        message: "User not found",
      });

    if (!req.files || !req.files.image || req.files.image.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const imageFile = req.files.image[0];
    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: "password_manager",
      resource_type: "image",
    });
    const imageUrl = result.secure_url;

    //! EARLIER VERSION
    // tags.split().forEach((element) => {
    //   element.toLowerCase();
    // });

    // ! NEW VERSION
    const formattedTags = tags
      .split(",")
      .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1))
      .sort();
    const newTags = [...new Set(["All", ...formattedTags])];

    // let tagList = tags.split(" ");
    // const newTags = [...new Set(["all", ...tags])];

    const newDomain = await Domain.create({
      user: id,
      icon: imageUrl,
      name,
      email,
      password,
      tags: newTags,
      description,
    });

    await User.findByIdAndUpdate(id, {
      $push: { domains: newDomain._id },
    });

    const domainWithoutPassword = newDomain.toObject();
    delete domainWithoutPassword.password;
    delete domainWithoutPassword.hashedPassword;

    res.status(200).json({
      success: true,
      message: "Domain created successfully",
      domain: domainWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating a domain",
      error: error.message,
    });
  }
};

exports.getAllDomain = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(id);
    const userDomains = await User.findById(id)
      .select("-password")
      .populate("domains", "_id name icon email");
    if (!userDomains)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "All domains fetched successfully",
      allDomains: userDomains,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching all domains",
      error: error.message,
    });
  }
};

exports.getSingleDomain = async (req, res) => {
  try {
    const { id } = req.user;
    const { domainId } = req.params;
    const domain = await Domain.findById(domainId);
    if (!domain)
      return res.status(404).json({
        success: false,
        message: "Domain not found",
      });

    res.status(200).json({
      success: true,
      message: "Domain fetched successfully",
      domain,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching a domain",
      error: error.message,
    });
  }
};

exports.deleteDomain = async (req, res) => {
  try {
    const { id } = req.user;
    const { domainId } = req.params;
    const domain = await Domain.findByIdAndDelete(domainId);
    if (!domain)
      return res.status(404).json({
        message: "Domain not found",
      });

    await User.findByIdAndUpdate(domain.user, {
      $pull: { domains: domainId },
    });

    res.status(200).json({
      success: true,
      message: "Domain deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting a domain",
      error: error.message,
    });
  }
};

exports.updateDomain = async (req, res) => {
  try {
    console.log("into the backend");
    const { id } = req.user;
    const { domainId } = req.params;
    const { name, email, password, tags, description } = req.body;

    // tags.forEach((element) => {
    //   element[0].toUpperCase() + element.substring(1);
    // });

    const newTags = [...new Set(["all", ...tags])];

    const updatedDomain = await Domain.findByIdAndUpdate(
      domainId,
      {
        user: id,
        name,
        email,
        password,
        tags: newTags,
        description,
      },
      { new: true, runValidators: true }
    );

    if (!updatedDomain)
      return res.status(404).json({
        success: false,
        message: "Domain not found",
      });

    res.status(200).json({
      success: true,
      message: "Domain updated successfully",
      updatedDomain,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating a domain",
      error: error.message,
    });
  }
};

// query search(optional)
exports.searchDomain = async (req, res) => {
  try {
    const { query, tags } = req.query;

    const filter = {};

    // Add name search if query exists
    if (query && query.trim() !== "") {
      filter.name = { $regex: query, $options: "i" };
    }

    // Add tags filter if tags exist
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      if (tagsArray.length > 0) {
        filter.tags = { $in: tagsArray };
      }
    }

    const domains = await Domain.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Domains searched successfully",
      data: domains,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while searching a domain",
      error: error.message,
    });
  }
};
