import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';

const packageDefinition = protoLoader.loadSync('grpc/proto/schedule.proto');
const scheduleProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(scheduleProto.ScheduleService.service, {
    GetStudent: (req, res) => {
    console.log(req.request);
    res(null, {name: ""}); 
    }
})

server.bindAsync("127.0.0.1:9090", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if(err != null){
        return console.error(err);
    }
    console.log(`gRPC listening on ${port}`)
    server.start();
});