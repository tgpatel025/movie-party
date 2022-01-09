const sql = require('mssql');
const dbConfig = require('../constants/database');


function addVideoMetadata(req) {
    return new Promise((resolve, reject) => {
        const pool = new sql.ConnectionPool(dbConfig.write);
        pool.connect().then((conn) => {
            conn.request()
                .input('Name', req.body.originalFileName)
                .input('Size', req.body.size)
                .input('UserGuid', req.body.userId)
                .input('VideoGuid', req.body.id)
                .execute('WriteSP.CreateOrUpdateMovieDetails').then(result => {
                    pool.close();
                    resolve(result.recordset[0].videoId);
                });
        }).catch(error => {
            console.log(error);
        });
    });
}

function updateVideoStatus(status, guid) {
    const pool = new sql.ConnectionPool(dbConfig.write);
    pool.connect().then((conn) => {
        conn.request()
            .input('Status', status)
            .input('VideoGuid', guid)
            .execute('WriteSP.UpdateVideoStatus').then(result => {
                pool.close();
            });
    }).catch(error => {
        console.log(error);
    });
}

function getVideoList() {
    return new Promise((resolve, reject) => {
        const pool = new sql.ConnectionPool(dbConfig.read);
        pool.connect().then((conn) => {
            conn.query('SELECT * FROM Video')
                .then(result => {
                    pool.close();
                    resolve(result.recordset);
                });
        }).catch(error => {
            console.log(error);
        });
    });
}

module.exports = {
    updateVideoStatus,
    getVideoList,
    addVideoMetadata
}