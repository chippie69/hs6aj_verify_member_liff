import liff from '@line/liff';

export async function initLiff(liffId: string) {
    if (!liff.isInClient() && !liff.isLoggedIn()) {
        liff.login();
    }
    await liff.init({ liffId });

    return await liff.getProfile();
}