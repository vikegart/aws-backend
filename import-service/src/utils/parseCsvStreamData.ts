import csv from 'csv-parser';

export const parseCsvStreamData = (stream) => {
    stream
        .pipe(csv())
        .on('data', (data) => {
            console.log('PARSED_DATA', data);
        })
        .on('error', (e) => {
            console.log('error', e);
        })
}