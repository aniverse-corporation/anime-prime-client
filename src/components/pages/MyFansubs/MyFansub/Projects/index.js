import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import LaunchIcon from '@material-ui/icons/Launch';
import TheatersIcon from '@material-ui/icons/Theaters';
import useStyles from './style';
import PanelTabs from '../PanelTabs';
import { Avatar, Box, Button, Container, FormControl, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, MenuItem, Select, Typography } from '@material-ui/core';
import { useHistory, useLocation, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useStore } from '../../../../../stores';
import * as api from '../../../../../api';
import ProjectsDialog from './ProjectsDialog';
import { Skeleton } from '@material-ui/lab';
import { toJS } from 'mobx';
import { Slide } from '@material-ui/core';
import { useSnackbar } from 'notistack';


const statusTypes = ['פעיל', 'מוקפא', 'הושלם', 'מתוכנן', 'ננטש'];

function Projects() {
    const store = useStore();
    const { userStore } = store;
    const { fansubStore } = store;
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const location = useLocation();
    const { fansubId } = useParams();
    const { projectId } = useParams();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    
    function openProjectDialog() {
        setOpen(true);
    }

    function handleDialogClose() {
        setOpen(false);
    }

    async function onStatusChange(projectId, updatedStatus) {
        fansubStore.updateProjectStatus(projectId, updatedStatus,
            () => {
                enqueueSnackbar('הסטטוס שונה בהצלחה', {variant: 'success'});
            },
            (error) => {
                enqueueSnackbar(error, {variant: 'error'});
            })
    }

    async function deleteProject(projectId) {
        fansubStore.deleteProject(projectId, 
            () => {
                enqueueSnackbar('הפרוייקט הוסר', {variant: 'success'});
            },
            (error) => {
                enqueueSnackbar(error, {variant: 'error'});
            })
    }

    const handleOnClick = (projectId) => {
        history.push(`/my-fansubs/${fansubId}/project/${projectId}/`);
    }

    return (
        <>
            <Slide direction="up" in>
                <Container maxWidth="lg">
                    <Paper elevation={5} className={classes.paper}>
                        <Typography align="center" component="h1" variant="h5" className={classes.title}>
                            פרוייקטים
                        </Typography>
                        {store.loading ?
                            <>
                                <Typography variant="h4">
                                    <Skeleton />
                                </Typography>
                                <Typography variant="h4">
                                    <Skeleton />
                                </Typography>
                                <Typography variant="h4">
                                    <Skeleton />
                                </Typography>
                            </>
                            :
                        <List >
                        {fansubStore.projects?.map((project) => (
                            <ListItem button key={project._id} onClick={() => handleOnClick(project._id)}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <TheatersIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={project.anime.name.hebrew}
                                />
                                <ListItemSecondaryAction>
                                    <FormControl size="small" variant="outlined">
                                        <InputLabel id="select-fansub-label">סטטוס</InputLabel>
                                        <Select
                                            labelId="choosen-fansub-label"
                                            id="choosen-fansub"
                                            label="פאנסאב"
                                            value={project.status}
                                            onChange={(e) => onStatusChange(project._id, e.target.value)}
                                        >
                                        {statusTypes.map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <IconButton aria-label="delete" onClick={() => deleteProject(project._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton aria-label="launch" onClick={() => window.open('/animes/' + project.anime._id + '?fansub=' + project.fansub, '_blank', 'noopener,noreferrer')}>
                                        <LaunchIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                        </List>
                    }

                        <Button variant="outlined" color="primary" onClick={openProjectDialog} disabled={store.loading}>
                            הוסף פרוייקטים +
                        </Button>

                    </Paper>
                </Container>
            </ Slide>
            <ProjectsDialog open={open} filteredProjects={fansubStore.projects} handleDialogClose={handleDialogClose}/>

        </>
    )
}

export default observer(Projects);