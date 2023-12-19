import json

import pytest


@pytest.mark.asyncio
async def test_api(client, test_app_with_db):
    response = await client.get("/api")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Twitter App"}


@pytest.mark.asyncio
async def test_get_users__me(client, headers, test_app_with_db):
    r = await client.get("api/users/me", headers=headers)
    curr_user = r.json()["user"]["name"]
    assert curr_user == "John Snow"
    assert r.status_code == 200


@pytest.mark.asyncio
@pytest.mark.parametrize("id_user", [1, 2, 3])
async def test_get_users_id(client, headers, id_user, test_app_with_db):
    r = await client.get(f"api/users/{id_user}", headers=headers)
    assert r.status_code == 200


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "id_user_follow, expected_result",
    [(1, True), (2, True), (3, False), (4, False), (5, False), (6, False)],
)
async def test_follow(
    client, headers, id_user_follow, expected_result, test_app_with_db
):
    r = await client.post(
        f"api/users/{id_user_follow}/follow",
        headers=headers,
        data=json.dumps({"whom_user": f"{id_user_follow}"}),
    )
    assert r.status_code == 200
    assert r.json() == {"result": expected_result}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "id_user_unfollow, expected_result",
    [(1, True), (2, True), (3, False), (4, False), (5, False), (6, False)],
)
async def test_unfollow(
    client, headers, id_user_unfollow, expected_result, test_app_with_db
):
    r = await client.delete(f"api/users/{id_user_unfollow}/follow", headers=headers)
    assert r.status_code == 200
    assert r.json() == {"result": expected_result}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "id_tweet, expected_result",
    [(3, False), (4, False), (5, False), (6, False), (7, False), (8, False)],
)
async def test_delete_tweet(
    client, headers, id_tweet, expected_result, test_app_with_db
):
    r = await client.delete(f"api/tweet/{id_tweet}", headers=headers)
    assert r.status_code == 200
    assert r.json() == {"result": expected_result}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "id_tweet, expected_result ",
    [(3, False), (4, False), (5, False), (6, False), (7, False), (8, False)],
)
async def test_like_in(client, headers, id_tweet, expected_result, test_app_with_db):
    r = await client.post(
        f"api/tweet/{id_tweet}/likes",
        headers=headers,
        data=json.dumps({"id_tweet": f"{id_tweet}"}),
    )
    assert r.status_code == 200
    assert r.json() == {"result": expected_result}


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "id_tweet,expected_result",
    [(3, False), (4, False), (5, False), (6, False), (7, False), (8, False)],
)
async def test_like_out(client, headers, id_tweet, expected_result, test_app_with_db):
    r = await client.delete(f"api/tweet/{id_tweet}/likes", headers=headers)
    assert r.status_code == 200


@pytest.mark.asyncio
@pytest.mark.smoke
@pytest.mark.parametrize(
    "tweet_data, expected_result, id_tweet",
    [
        ("tweet3", True, 3),
        ("tweet4", True, 4),
        ("tweet5", True, 5),
        ("tweet6", True, 6),
        ("tweet7", True, 7),
        ("tweet8", True, 8),
    ],
)
async def test_post_tweet(
    client, headers, tweet_data, expected_result, id_tweet, test_app_with_db
):
    r = await client.post(
        "api/tweets",
        headers=headers,
        data=json.dumps({"tweet_data": f"{tweet_data}", "tweet_media_ids": [0]}),
    )
    assert r.status_code == 200
    assert r.json() == {"result": expected_result, "tweet_id": id_tweet}


@pytest.mark.asyncio
@pytest.mark.skip(reason="do not find file, but locally all right")
@pytest.mark.parametrize("png", ["twitter.png"])
async def test_post_photo(client, headers, png, test_app_with_db):
    bytes_img = open(png, "rb")
    data = {"form": bytes_img.read()}
    r = await client.post("api/medias", headers=headers, files=data)
    assert r.status_code == 200


@pytest.mark.asyncio
@pytest.mark.smoke
@pytest.mark.parametrize(
    "id_tweet, expected_result ",
    [(1, True), (1, False), (2, True), (2, False)],
)
async def test_like_in_try(
    client, headers, id_tweet, expected_result, test_app_with_db
):
    r = await client.post(
        f"api/tweet/{id_tweet}/likes",
        headers=headers,
        data=json.dumps({"id_tweet": f"{id_tweet}"}),
    )
    assert r.status_code == 200
    assert r.json() == {"result": expected_result}


@pytest.mark.asyncio
@pytest.mark.smoke
@pytest.mark.parametrize(
    "id_tweet,expected_result",
    [(1, True), (1, False), (2, True), (2, False)],
)
async def test_like_out_try(
    client, headers, id_tweet, expected_result, test_app_with_db
):
    r = await client.delete(f"api/tweet/{id_tweet}/likes", headers=headers)
    assert r.status_code == 200
    assert r.json() == {"result": expected_result}


@pytest.mark.asyncio
@pytest.mark.smoke
@pytest.mark.parametrize(
    "id_tweet, expected_result",
    [(1, False), (2, True)],
)
async def test_delete_tweets(
    client, headers, id_tweet, expected_result, test_app_with_db
):
    r = await client.delete(f"api/tweet/{id_tweet}", headers=headers)
    assert r.status_code == 200
    assert r.json() == {"result": expected_result}
