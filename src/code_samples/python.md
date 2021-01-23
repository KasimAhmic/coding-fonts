---
layout: for_screenshot
title: Python Sample
---

<pre class="lang-python"><code>from time import time as current_time

class Timer:
    def __init__(self, start_now: bool) -> None:
        """
        :param start_now: Whether to start now or not
        """
        self.start = current_time if start_now else None
        self.end = None
        self.elapsed = None
        # self.delay = None

    def start(self) -> None:
        self.start = current_time()

    def end(self) -> None:
        self.end = current_time()
        self.elapsed = self.end - self.start

    @property
    def get_elapsed(self) -> float:
        return self.elapsed</code></pre>