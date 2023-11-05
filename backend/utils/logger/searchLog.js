import { readFile } from 'fs/promises';

export default function() {
    readFile(new URL('../../api-request.log', import.meta.url), (err, data) => {
        if(err) {
            console.log('Error reading log file', err);
        } else {
            console.log(data);
            const logs = data.split('\n');
            const errorLogs = logs.filter((log) => { 
                log.includes('error')
                console.log('Error logs:', errorLogs);
            });
        }
    });
}