import "./styles.css";
import * as api from "./api";

import React, { useState } from "react";
import getDay from "date-fns/getDay";

import {
  Button,
  Grid,
  Card,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Typography,
  Snackbar,
  Divider,
  Checkbox,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function dailyCheck() {
  const currentDay = getDay(new Date());
  const oldTasks = api.getTasks();

  oldTasks.forEach((t, index) => {
    switch (t.freq) {
      case "daily":
        if (t.oldDay < currentDay || (t.oldDay === 6 && currentDay === 0)) {
          t.done = false;
          t.oldDay = currentDay;
          api.updateTask(t);
        }
        break;
      case "weekly":
        if (t.oldDay === 6 && currentDay === 0) {
          t.sun = false;
          t.mon = false;
          t.tue = false;
          t.wed = false;
          t.thu = false;
          t.fri = false;
          t.sat = false;
          t.oldDay = currentDay;
          api.updateTask(t);
        }
        break;

      default:
        return;
    }
  });

  const newTasks = api.getTasks();
  return newTasks;
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [freq, setFreq] = useState("daily");
  const [tasks, setTasks] = useState(dailyCheck());
  const [info, setInfo] = useState({ type: "success", msg: "", delay: 3000 });
  const [snack, setsnack] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setOpen(true);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleDesc = (e) => {
    setDesc(e.target.value);
  };

  const handleFreq = () => {
    setFreq(freq === "daily" ? "weekly" : "daily");
  };

  const handleSnackClose = () => {
    setsnack(false);
    setInfo((prev) => ({ ...prev, msg: "" }));
  };

  const validate = () => {
    if (name !== "" && name !== " ") {
      setError(false);

      const task = {
        name,
        desc,
        freq,
        sun: false,
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        done: false,
        oldDay: getDay(new Date()),
      };
      api.addTask(task);
      setName("");
      setDesc("");
      setFreq("daily");
      const newTasks = api.getTasks();
      setOpen(false);
      setTasks(newTasks);
      setInfo((old) => ({ ...old, msg: "Task Added!" }));
      setsnack(true);
    } else {
      setError(true);
    }
  };

  const updateDaily = (task) => {
    task.done = true;
    api.updateTask(task);
    const newTasks = api.getTasks();
    setTasks(newTasks);
  };

  const updateWeekly = (task, day) => {
    task[day] = true;
    api.updateTask(task);
    const newTasks = api.getTasks();
    setTasks(newTasks);
  };

  const deleteTask = (task) => {
    api.deleteTask(task);
    const newTasks = api.getTasks();
    setTasks(newTasks);
  };

  return (
    <div className="App">
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onCLose={handleSnackClose}
        open={snack}
        autoHideDuration={info.delay}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity={info.type}>
          {info.msg}
        </Alert>
      </Snackbar>
      <Button
        style={{
          float: "right",
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
        variant="contained"
        color="primary"
        onClick={handleAdd}
      >
        Add New Task
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="dialog-title">
        <DialogTitle color="primary" id="dialog-title">
          New Task
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <FormGroup>
              <TextField
                value={name}
                onChange={handleName}
                label="Task Name"
                fullWidth
                error={error}
                helperText={error ? "Field Required" : null}
                autoFocus
              />
              <TextField value={desc} onChange={handleDesc} label="Task Description (optional)" fullWidth />
              <Grid container alignItems="center" style={{ marginTop: "15px" }}>
                <Grid item>
                  <Typography>Daily</Typography>
                </Grid>
                <Grid item>
                  <Switch checked={freq === "weekly"} onChange={handleFreq} color="primary" />
                </Grid>
                <Grid item>
                  <Typography>Weekly</Typography>
                </Grid>
              </Grid>
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={validate} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Typography style={{ color: "white", marginTop: "15px", textAlign: "left" }} variant="h4" gutterbottom>
        Daily Tasks
      </Typography>
      <hr />
      <Grid container id="daily-grid" justify="flex-start" spacing={3}>
        {tasks
          .filter((tas) => {
            if (tas.freq === "daily") return tas;
          })
          .map((t) => {
            return (
              <Grid xs={12} md={6} lg={4} item>
                <Paper elevation={3}>
                  <Typography variant="h5">{t.name}</Typography>
                  <Divider />
                  <Typography variant="subtitle1">{t.desc}</Typography>
                  <ul>
                    <li style={{ listStyleType: "none", textAlign: "left" }}>
                      <FormControlLabel
                        disabled={t.done}
                        control={
                          <Checkbox checked={t.done} disabled={t.sun} onChange={() => updateDaily(t)} color="primary" />
                        }
                        label="Done"
                      />
                    </li>
                  </ul>
                  <Button
                    variant="contained"
                    style={{ marginBottom: "10px" }}
                    color="secondary"
                    onClick={() => deleteTask(t)}
                  >
                    Delete
                  </Button>
                </Paper>
              </Grid>
            );
          })}
      </Grid>

      {/* ------------------------------------------- */}

      <Typography style={{ color: "white", marginTop: "100px", textAlign: "left" }} variant="h4" gutterbottom>
        Weekly Tasks
      </Typography>
      <hr />
      <Grid container id="weekly-grid" justify="flex-start" spacing={3}>
        {tasks
          .filter((tas) => {
            if (tas.freq === "weekly") return tas;
          })
          .map((t) => {
            return (
              <Grid xs={12} md={6} lg={4} item>
                <Paper elevation={3}>
                  <Typography variant="h5">{t.name}</Typography>
                  <Divider />
                  <Typography variant="subtitle1">{t.desc}</Typography>
                  <ul>
                    <li style={{ listStyleType: "none", textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={t.sun}
                            disabled={t.sun}
                            onChange={() => updateWeekly(t, "sun")}
                            color="primary"
                          />
                        }
                        label="Sunday"
                      />
                    </li>
                    <li style={{ listStyleType: "none", textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={t.mon}
                            disabled={t.mon}
                            onChange={() => updateWeekly(t, "mon")}
                            color="primary"
                          />
                        }
                        label="Monday"
                      />
                    </li>
                    <li style={{ listStyleType: "none", textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={t.tue}
                            disabled={t.tue}
                            onChange={() => updateWeekly(t, "tue")}
                            color="primary"
                          />
                        }
                        label="Tuesday"
                      />
                    </li>
                    <li style={{ listStyleType: "none", textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={t.wed}
                            disabled={t.wed}
                            onChange={() => updateWeekly(t, "wed")}
                            color="primary"
                          />
                        }
                        label="Wednesday"
                      />
                    </li>
                    <li style={{ listStyleType: "none", textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={t.thu}
                            disabled={t.thu}
                            onChange={() => updateWeekly(t, "thu")}
                            color="primary"
                          />
                        }
                        label="Thursday"
                      />
                    </li>
                    <li style={{ listStyleType: "none", textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={t.fri}
                            disabled={t.fri}
                            onChange={() => updateWeekly(t, "fri")}
                            color="primary"
                          />
                        }
                        label="Friday"
                      />
                    </li>
                    <li style={{ listStyleType: "none", textAlign: "left" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={t.sat}
                            disabled={t.sat}
                            onChange={() => updateWeekly(t, "sat")}
                            color="primary"
                          />
                        }
                        label="Saturday"
                      />
                    </li>
                  </ul>
                  <Button
                    variant="contained"
                    style={{ marginBottom: "10px" }}
                    color="secondary"
                    onClick={() => deleteTask(t)}
                  >
                    Delete
                  </Button>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
      {/* <Paper style={{ marginTop: "100px" }} elevation={3}>
        Test
      </Paper> */}
    </div>
  );
}
