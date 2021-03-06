const Machine = require("../database/schema/Machine");

// @route   GET   /machines
// @desc    get list of all machines in the system
// @access  Private
const getMachines = async (req, res) => {
  try {
    // pass empty filter to get all data
    let filter = {};
    if (req.query) {
      filter = { ...req.query };
    }

    // sort ascending order by location
    const allMachines = await Machine.find(filter).sort("-location");

    if (!allMachines) {
      res.status(404).json({ error: "Entries not found" });
    }

    res.json(allMachines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// @route   POST  /machines
// @desc    add new machine to the system
// @access  Private
const addMachine = async (req, res) => {
  try {
    const { location, branch, machineNumber } = req.body;

    // In case it already has the machine with this data
    const oldMachine = await Machine.findOne({
      location,
      branch,
      machineNumber,
    });
    if (oldMachine) {
      return res.status(409).json({
        error: `The machine with this information has already existed in the database. Please refer to ${oldMachine._id} `,
      });
    }

    const newMachine = new Machine({
      location,
      branch,
      machineNumber,
    });

    // Save to database
    await newMachine.save();

    return res.status(201).json(newMachine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// @route   GET   /machines/:id
// @desc    get machine's data
// @access  Public
const getMachine = async (req, res) => {
  const _id = req.params.id;
  try {
    const data = await Machine.findOne({ _id });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

// @route   PUT   /machines/:id
// @desc    change machine's data
// @access  Private
const updateMachine = async (req, res) => {
  const _id = req.params.id;

  try {
    // Check if the new data conflict with the old data or not
    const toBeUpdatedData = await Machine.findOne({ _id }).select("-_id -__v");
    const existingData = await Machine.findOne({
      ...toBeUpdatedData,
      ...req.body,
    }).select("_id");

    if (existingData) {
      if (existingData._id == _id)
        return res.status(400).json({
          error: `Editing the machine with the same information (Machine: ${_id})`,
        });
      return res.status(409).json({
        error: `The machine with this information has already existed in the database. Please refer to ${existingData._id} `,
      });
    }

    // Update data with req.body
    const updatedData = await Machine.findOneAndUpdate(
      { _id },
      { $set: { ...req.body } },
      { returnDocument: "after" }
    );

    res.json(updatedData);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

// @route   DEL   /machines/:id
// @desc    remove machine's data from the system
// @access  Private
const deleteMachine = async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedMachine = await Machine.findOneAndDelete({ _id });
    res.json(deletedMachine);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  getMachines,
  addMachine,
  getMachine,
  updateMachine,
  deleteMachine,
};
