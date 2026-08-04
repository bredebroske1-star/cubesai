package com.example.lazycat;

import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.Set;

public class BlockingWebViewClient extends WebViewClient {
    private final Set<String> blockedHosts;

    public BlockingWebViewClient(Set<String> blockedHosts) {
        this.blockedHosts = blockedHosts;
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        String host = request.getUrl().getHost();
        if (host != null && blockedHosts.contains(host)) {
            // Block navigation
            return true;
        }
        return super.shouldOverrideUrlLoading(view, request);
    }
}
