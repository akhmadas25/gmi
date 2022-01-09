const { response } = require("express");
const { user } = require("../../models");

exports.updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { ...data } = req.body;
    await user.update(
      {
        ...data,
      },
      {
        where: {
          id,
        },
      }
    );
    res.ststus(200).send({
      status: 200,
      message: "profile successfully updated!",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "server error",
    });
    console.log(error);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const data = await user.findAll({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.status(200).send({
      status: 200,
      profile: data,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "server error",
    });
    console.log(error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const data = await user.findAll();
    res.send({
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "server error",
    });
    console.log(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await user.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: 200,
      data: data,
      message: "user has successfully deleted",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "server error",
    });
    console.log(error);
  }
};
