import type { BackgroundRequest, BackgroundResponse } from "../../lib/messages";

export async function bgCall(req: BackgroundRequest): Promise<BackgroundResponse> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(req, (res: BackgroundResponse) => resolve(res));
  });
}

