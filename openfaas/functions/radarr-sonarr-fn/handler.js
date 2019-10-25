"use strict"

const get = require('lodash/get')

const DASHBOARD_ID = process.env.DASHBOARD_ID
const PANEL_ID = process.env.PANEL_ID
const GRAFANA_URL = process.env.GRAFANA_URL
const GRAFANA_PORT = process.env.GRAFANA_PORT

if( DASHBOARD_ID === undefined || PANEL_ID === undefined) {
    console.error("DASHBOARD_ID and/or PANEL_ID are undefined. This will create globals annotations.")
    process.exit(1)
}

if (GRAFANA_URL === undefined || GRAFANA_PORT === undefined) {
    console.error("GRAFANA_URL and/or GRAFANA_PORT are undefined. Cannot create annotations.")
    process.exit(2)
}

const EVENT_DOWNLOAD = 'Download'
const EVENT_UPGRADE = 'Upgrade'

// Radarr
const getMovieMessage = event => {
    const { eventType, movie, release } = event

    let message = `Radarr: `
    switch (eventType) {
        case EVENT_DOWNLOAD:
            message += `${movie.title} is ready to watch in ${release.quality}`
            break
        case EVENT_UPGRADE:
            message += `${movie.title} has upgraded to ${release.quality}`
            break
        default:
            message += `Message for '${eventType}' event is not defined`
            break
    }

    return {tags: ["Radarr", eventType], text: message}
}

// Sonarr
const getTVShowMessage = event => {
    const { eventType, episodes, series } = event

    let epTitles = []
    episodes.forEach(episode => {
        const { title, seasonNumber, episodeNumber } = episode
        epTitles.push(`${title} (S${seasonNumber}E${episodeNumber})`)
    })

    let message = `Sonarr: `
    switch (eventType) {
        case EVENT_DOWNLOAD:
            message += `${series.title} has episodes '${epTitles.join(
                ', '
            )}' ready to watch`
            break
        case EVENT_UPGRADE:
            message += `${series.title} have upgraded episodes '${epTitles.join(
                ', '
            )}' ready to watch`
            break
        default:
            message += `Message for '${eventType}' event is not defined`
            break
    }

    return {tags: ["Sonarr", eventType], text: message}
}

const CREATE_ANNOTATION_API = "/api/annotations"
const CREATE_ANNOTATION_METHOD = "POST"

const notifyGrafana = annotation => {

    console.log("Creating annotation : " + annotation)

    let options = {
        "method": CREATE_ANNOTATION_METHOD,
        "host": GRAFANA_URL,
        "port": GRAFANA_PORT,
        "path": CREATE_ANNOTATION_API,
        "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }

    return new Promise((resolve, reject) => {

        let request = http.request(options, function (res) {

            let data = '';

                res.on("data", function (chunk) {
                    data += chunk;
                })

                res.on("end", function () {

                    console.log("Here is the data: " + JSON.parse(data));

                    if (res.statusCode === 200 || res.statusCode === 204) {
                        resolve(data)
                    }else {
                        reject(data)
                    }
                })

                req.on('error', (error) => {
                    console.error("Got an error:" + error)
                    reject(error)
                })
        })

        request.write(annotation)
        request.end()

    })

}

module.exports = (context, callback) => {

    console.log('Function called', context)
    const eventType = get(context, 'eventType', null)

    if (eventType === null) {
        callback({ error: "eventType is not defined. Received " + context }, undefined)
        process.exit(1)
    }

    // Check if we're parsing a Radarr or Sonarr event
    const movie = get(context, 'movie', null)
    if (movie !== null) {
        // Radarr event
        console.log("Radarr event")
        var {tags, text} = getMovieMessage(context)

    } else {
        console.log("Sonarr event")
        // Sonarr event
        var {tags, text} = getTVShowMessage(context)
    }

    console.log(tags)
    console.log(text)

    notifyGrafana({
        dashboardId: DASHBOARD_ID,
        panelId: PANEL_ID,
        time: Date.now(),
        tags,
        text
    }).then(res => {
        callback(undefined, res);
    }).catch(err => {
        callback(err, undefined);
    })
}

