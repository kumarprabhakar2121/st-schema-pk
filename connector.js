const { SchemaConnector, DeviceErrorTypes } = require("st-schema");
const deviceStates = { switch: "off", level: 100 };
const connector = new SchemaConnector()
    .discoveryHandler((accessToken, response) => {
        console.log(`🚀 ${(new Date).toLocaleString()} ~ file: connector.js:5 ~ .discoveryHandler ~ response:`, response)

        console.log(`🚀 ${(new Date).toLocaleString()} ~ file: connector.js:5 ~ .discoveryHandler ~ accessToken:`, accessToken)

        response
            .addDevice("external-device-1", "Test Dimmer", "c2c-dimmer")
            .manufacturerName("Example Connector")
            .modelName("Virtual Dimmer");
    })
    .stateRefreshHandler((accessToken, response) => {
        console.log(`🚀 ${(new Date).toLocaleString()} ~ file: connector.js:15 ~ .stateRefreshHandler ~ response:`, response)

        console.log(`🚀 ${(new Date).toLocaleString()} ~ file: connector.js:15 ~ .stateRefreshHandler ~ accessToken:`, accessToken)

        response.addDevice("external-device-1", [
            {
                component: "main",
                capability: "st.switch",
                attribute: "switch",
                value: deviceStates.switch
            },
            {
                component: "main",
                capability: "st.switchLevel",
                attribute: "level",
                value: deviceStates.level
            }
        ]);
    })
    .commandHandler((accessToken, response, devices) => {
        console.log(`🚀 ${(new Date).toLocaleString()} ~ file: connector.js:35 ~ .commandHandler ~ devices:`, devices)

        console.log(`🚀 ${(new Date).toLocaleString()} ~ file: connector.js:35 ~ .commandHandler ~ response:`, response)

        console.log(`🚀 ${(new Date).toLocaleString()} ~ file: connector.js:35 ~ .commandHandler ~ accessToken:`, accessToken)

        for (const device of devices) {
            const deviceResponse = response.addDevice(device.externalDeviceId);
            for (cmd of device.commands) {
                const state = {
                    component: cmd.component,
                    capability: cmd.capability
                };
                if (cmd.capability === "st.switchLevel" && cmd.command === "setLevel") {
                    state.attribute = "level";
                    state.value = deviceStates.level = cmd.arguments[0];
                    deviceResponse.addState(state);
                } else if (cmd.capability === "st.switch") {
                    state.attribute = "switch";
                    state.value = deviceStates.switch = cmd.command === "on" ? "on" : "off";
                    deviceResponse.addState(state);
                } else {
                    deviceResponse.setError(
                        `Command '${cmd.command} of capability '${cmd.capability}' not supported`,
                        DeviceErrorTypes.CAPABILITY_NOT_SUPPORTED
                    );
                }
            }
        }
    });

module.exports = connector;

