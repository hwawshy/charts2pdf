import express from 'express'
import bodyParser from "body-parser";
import { createServer as createViteServer } from 'vite'

(async () => {
    const isProd = process.env.NODE_ENV === 'production';

    const app = express()

    app.use(bodyParser.json())

    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    let vite;
    if (!isProd) {
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom',
            configFile: './vite.config.server.ts',
        })

        // Use vite's connect instance as middleware. If you use your own
        // express router (express.Router()), you should use router.use
        app.use(vite.middlewares)
    }

    app.use('/ssr', async (req, res, next) => {
        try {
            console.log(`Received request: ${JSON.stringify(req.body)}`)

            const { component, props } = req.body;
            // 3. Load the server entry. ssrLoadModule automatically transforms
            //    ESM source code to be usable in Node.js! There is no bundling
            //    required, and provides efficient invalidation similar to HMR.
            const { render } = isProd ? await import('./ssr/app.js') : await vite.ssrLoadModule(component)

            // 4. render the app HTML. This assumes entry-server.js's exported
            //     `render` function calls appropriate framework SSR APIs,
            //    e.g. ReactDOMServer.renderToString()
            const appHtml = render(props)

            // 6. Send the rendered HTML back.
            res.status(200).set({ 'Content-Type': 'application/json' }).end(JSON.stringify({appHtml: appHtml}))

            console.log('Sent response');
        } catch (e) {
            // If an error is caught, let Vite fix the stack trace, so it maps back
            // to your actual source code.
            if (!isProd) {
                vite.ssrFixStacktrace(e)
            }
            next(e)
        }
    })

    const server = app.listen(5175)

    console.log('SSR: waiting for requests');

    // Handle shutdown signals
    const shutdown = async (signal) => {
        console.log(`Received ${signal}. Closing servers...`);

        // Close Express server
        server.close(() => {
            console.log('Express server closed');
        })

        // Close Vite server if it exists
        if (vite) {
            await vite.close().then(() => {
                console.log('Vite server closed')
            })
        }

        process.exit(0)
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
})();
