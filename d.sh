curl -X POST https://api.dropboxapi.com/2/files/delete_v2 \
    --header "Authorization: Bearer QiI-01-ZPYIAAAAAAAAAATi46_Y9hAEF_2dR7dIXklxi1KZ0OaQuamzfCMXgCZR2" \
    --header "Content-Type: application/json" \
    --data "{\"path\": \"/apps/markdown-static/how-to-setup-babel-in-node.js.md\"}"


    curl -X POST https://content.dropboxapi.com/2/files/download \
        --header "Authorization: Bearer QiI-01-ZPYIAAAAAAAAAATi46_Y9hAEF_2dR7dIXklxi1KZ0OaQuamzfCMXgCZR2" \
        --header "Dropbox-API-Arg: {\"path\": \"/apps/markdown-static/how-to-setup-babel-in-node.js.md\"}"