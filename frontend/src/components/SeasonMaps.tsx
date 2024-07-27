import { Box, Button, Grid, Modal } from '@mui/material'
import { IMapData, ISeasonData, getMapRecord } from '../services/trackmaniaApi'
import { useEffect, useState } from 'react'
import MapCard from './MapCard'
import { getFavorites } from '../services/localStorageService'
import NewComponent from './NewComponent'
import { useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

function SeasonMaps({ season }: { season: ISeasonData }) {
    const [favorites, setFavorites] = useState<string[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedMap, setSelectedMap] = useState<IMapData>()

    useEffect(() => {
        const storedFavorites = getFavorites()
        setFavorites(storedFavorites)
    }, [])

    function handleCloseModal() {
        setModalOpen(false)
    }

    async function refreshMap() {
        if (!selectedMap || !modalOpen) return

        const map = await getMapRecord(selectedMap.mapId)
        if (!map) return
        const newDelta = map.personalBest - selectedMap.authorScore
        setSelectedMap((prev) =>
            prev ? { ...prev, ...map, delta: newDelta } : prev
        )
    }
    function formatTime(ms: number, symbol?: '+' | '-'): string {
        if (ms === 0) return '-: - -.- - -  '

        const minutes = Math.floor(ms / 60000)
        const seconds = ((ms % 60000) / 1000).toFixed(3)
        return `${symbol ?? ''}${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`
    }

    function formatDelta(ms: number): string {
        return formatTime(Math.abs(ms), ms > 0 ? '+' : '-')
    }

    const [params, setParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const mapParam = params.get('map')

        // if no map selected, select the map from the url
        if (!selectedMap && mapParam) {
            const mapFromUrl = season.maps.find(
                (_map) => _map.num === parseInt(mapParam)
            )
            if (mapFromUrl) {
                setSelectedMap(mapFromUrl)
            } else {
                navigate('/seasons')
            }
        }

        // if map selected, set params to the selected map
        if (selectedMap) {
            setParams({ map: selectedMap.num.toString() })
        }
    }, [selectedMap])

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (modalOpen && (event.key === 'r' || event.key === 'R')) {
                console.log('R key pressed')
                refreshMap()
            }
        }

        if (modalOpen) {
            window.addEventListener('keydown', handleKeyPress)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [modalOpen])

    if (!season) {
        return <p>Loading...</p>
    }

    return (
        <>
            <Grid
                container
                spacing={1}
                sx={{
                    width: '90%',
                    maxWidth: '850px',
                    transform: 'skewX(-10deg)',
                }}
            >
                {Array.from({ length: 5 }, (_, columnIndex) => (
                    <Grid item xs={12 / 5} key={columnIndex}>
                        {season.maps
                            .slice(columnIndex * 5, (columnIndex + 1) * 5)
                            .map((map, index) => (
                                <MapCard
                                    key={index}
                                    mapData={map}
                                    favorites={favorites}
                                    setFavorites={setFavorites}
                                    setSelectedMap={setSelectedMap}
                                    setModalOpen={setModalOpen}
                                />
                            ))}
                    </Grid>
                ))}
            </Grid>
            <NewComponent selectedMap={selectedMap} />
        </>
    )
}

export default SeasonMaps
