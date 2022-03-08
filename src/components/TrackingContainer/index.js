import React, { useState, useEffect } from 'react';
import { addAnime } from '../../stores/UserStore'
import { Link, useHistory, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControl, FormHelperText, Input, InputLabel, Link as MuiLink, ListItemText, MenuItem, Select } from '@material-ui/core/';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Grow, Slide, Paper } from '@material-ui/core';
import useStyles from './style';
import AnimeCard from '../Cards/AnimeCards/AnimeCard';
import AnimeCards from '../Cards/AnimeCards';
import { useStore } from '../../stores';
import { observer } from 'mobx-react-lite';
import { autorun, runInAction } from 'mobx';
import * as api from '../../api';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import { animeScheme } from '@aniverse/utils/validations';
import errorMessage from '../../errorMessage';
import InfiniteScroll from 'react-infinite-scroll-component';
import PaperWithHeader, { PaperBody, PaperHeader, PaperHeaderSection } from '../PaperWithHeader';
import SearchBar from '../SearchBar/SearchBar';

function TrackingContainer({title, userId, fetchCallback, trackingStatus}) {
    const history = useHistory();
    const classes = useStyles();
    const store = useStore();
    const { enqueueSnackbar } = useSnackbar();
    const [keyword, setKeyword] = useState('');
    const [search, setSearch] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [cards, setCards] = useState([]);
    const limit = 7;
    const skipStart = 0;
    const [skip, setSkip] = useState(skipStart);

    useEffect(async () => {
        store.startLoading();
        try {
            const { data } = await fetchCallback(userId, trackingStatus, search, skipStart, limit);
            if(data.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(true);
                setSkip(skip + limit);
            }
            setCards(data);
        } catch (err) {
            console.error(err.response);
        } finally {
            store.stopLoading();
        }
    }, []);

    const handleOnChange = (e) => {
        setKeyword(e.target.value);
    }

    const handleOnSearch = async (e) => {
        setSearch(keyword);
        store.startLoading();
        try {
            const { data } = await fetchCallback(userId, trackingStatus, keyword, skipStart, limit);
            if(data.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(true);
                setSkip(skip + limit);
            }
            setCards(data);
        } catch (err) {
            console.error(err.response);
        } finally {
            store.stopLoading();
        }
    }

    const fetchMoreData = async () => {
        store.startLoading();
        try {
            const { data } = await fetchCallback(userId, trackingStatus, search, skip, limit);
            if(data.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(true);
                setCards([...cards, ...data]);
                setSkip(skip + limit);
            }
        } catch (err) {
            console.error(err.response);
        } finally {
            store.stopLoading();
        }
    }

    return (
        <Container style={{marginTop: 30}}>
            <PaperWithHeader>
                <PaperHeader divider>
                    <PaperHeaderSection align="right" justify="center">
                        <Typography align="center" variant="h4">
                            {title}
                        </Typography>
                    </PaperHeaderSection>
                    <PaperHeaderSection align="center" justify="center">
                        <SearchBar value={keyword} placeholder="חפשו אנימה..." onChange={handleOnChange} onSearch={handleOnSearch} />
                    </PaperHeaderSection>
                </PaperHeader>

                <PaperBody loading={!cards}>
                    <InfiniteScroll
                        style={{paddingRight: 7, paddingLeft: 7}}
                        maxHeight={350}
                        dataLength={cards.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                            <p style={{ textAlign: 'center' }}>
                                <b>טוען</b>
                            </p>
                        }
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                        >
                            <br/>
                            <AnimeCards clickable animes={cards?.map((card) => card.animeId)} />
                    </InfiniteScroll>
                </PaperBody>
            </PaperWithHeader>
        </Container>
    );
}

export default TrackingContainer;