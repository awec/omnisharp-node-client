import {expect} from 'chai';
import {Driver, DriverState, OmnisharpClient} from "../lib/omnisharp-client";
import {join} from "path";

declare var xdescribe: Function;

describe("Omnisharp Server", function() {
    it("must construct", () => {
        new OmnisharpClient({
            projectPath: join(__dirname, "fixture/ConsoleApplication")
        });
    });

    it("must construct with a specific driver", () => {
        new OmnisharpClient({
            driver: Driver.Stdio,
            projectPath: join(__dirname, "fixture/ConsoleApplication")
        });
    });

    describe('state', function() {

        this.timeout(20000);
        var server: OmnisharpClient;

        before((done) => {
            server = new OmnisharpClient({
                driver: Driver.Stdio,
                projectPath: join(__dirname, "fixture/ConsoleApplication")
            });

            server.connect();

            var sub = server.state.subscribe(state => {
                if (state === DriverState.Connected) {
                    sub.dispose();
                    done();
                }
            });
        })

        it("must respond to all requests", function(done) {
            var count = 4;
            server.observeCheckalivestatus.subscribe((data) => {
                count--;
                if (!count)
                    done();
            });

            server.checkalivestatus();
            server.checkalivestatus();
            server.checkalivestatus();
            server.checkalivestatus();
        });

        it("must give status", function(done) {

            var sub = server.status.subscribe(status => {
                sub.dispose();
                done();
            })

            server.checkalivestatus();
            server.checkalivestatus();

        });
    });

});
