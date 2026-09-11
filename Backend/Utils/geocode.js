const axios = require("axios");

async function geocodeLocation(locationText) {

    if (!locationText || typeof locationText !== "string") {
        throw new Error("locationText is required");
    }

    const query = encodeURIComponent(
        locationText.trim()
    );

    const url =
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`;

    const response = await axios.get(url, {
        headers: {
            "User-Agent": "SwapWear-Clothing-Exchange/1.0"
        },
        timeout: 10000
    });

    const result = response.data?.[0];

    if (!result) {
        return null;
    }

    return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name
    };
}


function getDistanceInKm(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


function filterNearbyEngineers(
    engineers,
    lat,
    lng,
    maxDistanceKm = 10
) {

    return engineers

        .map((engineer) => {

            const engineerObj =
                typeof engineer.toObject === "function"
                    ? engineer.toObject()
                    : engineer;

            if (
                !engineerObj?.location?.coordinates ||
                engineerObj.location.coordinates.length !== 2
            ) {
                return null;
            }

            const [
                lngCoord,
                latCoord
            ] = engineerObj.location.coordinates;

            const distance =
                getDistanceInKm(
                    latCoord,
                    lngCoord,
                    lat,
                    lng
                );

            return {
                ...engineerObj,
                distance
            };
        })

        .filter(
            (engineer) =>
                engineer &&
                engineer.distance <= maxDistanceKm
        )

        .sort(
            (a, b) =>
                a.distance - b.distance
        );
}


function sortNearbyEngineers(
    engineers,
    lat,
    lng,
    maxDistanceKm = 10
) {

    return filterNearbyEngineers(
        engineers,
        lat,
        lng,
        maxDistanceKm
    );
}


module.exports = {
    geocodeLocation,
    filterNearbyEngineers,
    sortNearbyEngineers
};