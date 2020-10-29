import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionActions from '@material-ui/core/AccordionActions'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done'
import PautaService from '../services/PautaService'
import InfiniteScroll from 'react-infinite-scroll-component'
import Skeleton from '@material-ui/lab/Skeleton'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import HowToVote from '@material-ui/icons/HowToVote'
import Header from '../components/Header'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

function SkeletonList() {
    return (
        <React.Fragment>
            <Skeleton variant="rect" width="100%">
                <div style={{ paddingTop: '100px' }} />
            </Skeleton>
            <br />
            <Skeleton variant="rect" width="100%">
                <div style={{ paddingTop: '100px' }} />
            </Skeleton>
            <br />
            <Skeleton variant="rect" width="100%">
                <div style={{ paddingTop: '100px' }} />
            </Skeleton>
            <br />
            <Skeleton variant="rect" width="100%">
                <div style={{ paddingTop: '100px' }} />
            </Skeleton>
        </React.Fragment>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    accordion: {
        padding: theme.spacing(3),
        marginBottom: theme.spacing(2),
        '&::before': {
            backgroundColor: 'transparent'
        }
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
        fontWeight: 'bold',
        flexGrow: 1
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        verticalAlign: 'middle',
        textAlign: 'justify'
    },
    accordionIcon: {
        marginLeft: theme.spacing(2)
    }
}))

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

export default function Pautas() {
    const classes = useStyles()
    const [expanded, setExpanded] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [pautas, setPautas] = useState([])
    const [page, setPage] = useState(0)
    const [snackbarConfig, setSnackbarConfig] = useState({ open: false, message: '', severity: 'error' })

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setSnackbarConfig({ open: false, message: '', severity: 'error' })
    }

    const pautaService = new PautaService()

    const listPautas = () => {
        pautaService.getPagedList(page, (success) => {
            const content = success.content

            content.map(pauta => {
                pauta.titulo = pauta.titulo.toUpperCase()
                setPautas(pautas => [...pautas, pauta])
            })

            setPage(page + 1)
            setHasMore(!success.last)
        }, (error) => {
            alert(error)
        })
    }

    useEffect(() => {
        listPautas()
    }, [])


    return (
        <div className={classes.root}>
            <Header title="Pautas" novaPauta />
            <InfiniteScroll
                dataLength={pautas.length}
                next={listPautas}
                hasMore={hasMore}
                loader={<SkeletonList />}
                endMessage={
                    <p>
                        {pautas.length} resultados carregados.
                    </p>
                }
            >
                {pautas.map((prop, key) => (
                    <Accordion className={classes.accordion} variant="outlined"
                        expanded={expanded === key}
                        onChange={handleChange(key)} key={key}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className={classes.accordionIcon} />}
                            aria-controls={key + '-content'}
                            id={key + '-header'}
                        >
                            <Typography className={classes.heading}>{prop.titulo}</Typography>
                            <Chip
                                avatar={<Avatar>{prop.autor.nome.substr(0, 1)}</Avatar>}
                                label={prop.autor.nome}
                                clickable
                                color="primary"
                                title="Autor"
                                variant="outlined"
                            />
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <Typography className={classes.secondaryHeading}><b>Data de criação:</b> {new Date(prop.creation_date).toLocaleDateString()}</Typography>
                                <Typography className={classes.secondaryHeading}><b>Email do autor:</b> {prop.autor.email}</Typography>
                                <Divider />
                                <br />
                                <Typography className={classes.secondaryHeading}>
                                    {prop.descricao}
                                </Typography>
                            </div>
                        </AccordionDetails>
                        <Divider />
                        <AccordionActions>
                            <Button
                                color="primary"
                                size="small"
                                variant="outlined"
                                href={`pautas/${prop.id}/votacao`}
                                startIcon={<HowToVote />}
                            >
                                Iniciar Votação
                            </Button>
                        </AccordionActions>
                    </Accordion>
                ))}
            </InfiniteScroll>
            <Snackbar open={snackbarConfig.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbarConfig.severity}>
                    {snackbarConfig.message}
                </Alert>
            </Snackbar>
        </div>
    )
}