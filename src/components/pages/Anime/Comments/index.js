import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import useStyles from './style';
import SearchBar from '../../../SearchBar/SearchBar';
import { Container, Typography } from '@material-ui/core';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { useHistory } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useStore } from '../../../../stores';
import * as api from '../../../../api';
import Comment from '../../../Comment';


function Comments({comments}) {
    const { animeId, episodeId } = useParams();
    const store = useStore();
    const { userStore } = store;
    const classes = useStyles();

    useEffect(async () => {
        // store.startLoading();
        // try {
        //     const { data } = await api.fetchAnimeAndEpisode(animeId, episodeId);
        //     setEpisode(data);
        // } catch (err) {
        //     console.error(err.response);
        // } finally {
        //     store.stopLoading();
        // }
    }, [episodeId]);

    return (
        <>
            <Container maxWidth="lg">
                <Comment />
            </Container>

        </>
    )
}

export default Comments;
