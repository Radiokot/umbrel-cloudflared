<script>
    /**
     * @type {string}
     */
    export let publicEndpoint;

    /**
     * @type {string}
     */
    export let serviceUrl;
</script>

<div class="route-row d-flex">
    <img class="image me-3 me-md-4" src="/route-image.svg" alt="Route" />
    <div>
        <p class="endpoint line-clamp">
            <b>
                <a href="https://{publicEndpoint}" target="_blank">
                    {publicEndpoint}
                </a>
            </b>
        </p>
        <small class="line-clamp">
            {serviceUrl}
        </small>
    </div>
</div>

<style>
    .route-row .image {
        height: 5.25em;
    }

    .route-row .endpoint {
        margin-top: 0.5em;
        margin-bottom: 1.75em;
    }

    .line-clamp {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }
</style>
