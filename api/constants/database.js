const DatabaseConfig = {
    read: {
        user: 'MovieParty_ReadSP',
        password: 'M0v1Ep4RtyR3ad',
        database: 'MovieParty',
        server: 'LAPTOP-2Q9U3MLG',
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    },
    write: {
        user: 'MovieParty_WriteSP',
        password: 'M0v1Ep4RtyWr1t3',
        database: 'MovieParty',
        server: 'LAPTOP-2Q9U3MLG',
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    }
};

module.exports = DatabaseConfig;