# Chat Completion Introduction
In general scenarios, it's recommended to prioritize using **MiniMax-M1**, as it supports a longer context window and can better assist you in handling complex issues. If you’d like to use our **MiniMax-VL-01** model, simply adjust the parameter to include an image as input when using **MiniMax-Text-01**.

## API

- **API Endpoint:** `https'://api.minimax.io/v1/text/chatcompletion_v2`
- **OpenAI SDK Endpoint:** `https://api.minimax.io/v1`
 
## Models

| Model | Content Window (tokens) |
|---|---|
| MiniMax-M1 | 1000192 |
| MiniMax--Text-01| 1000192 |

## Parameters
### Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| Authorization | `string` | **Required** | Your API Secret Key. |
| Content-Type | `string` of `application/json` | **Required**| The request content type must be `application/json`. |
| model | `string`| **Required**| Choose between "MiniMax-M1" and "MiniMax-Text-01". (For "MiniMax-M1," streaming output is recommended for stability.) |
| stream | `boolean` | Optional| A boolean indicating whether to return results in batches by streaming. Defaults to `false`. When true, results are returned in batches, separated by two newlines. |
| max_tokens | `integer` (0, 40000] | Optional| The maximum number of tokens that can be generated in the chat completion. "MiniMax-M1" defaults to 8192, and "MiniMax-Text-01" defaults to 2048. |
| temperature | `float` [0, 1] | Optional | A value between 0 and 2 that controls the randomness of the output. Higher values (e.g., 0.8) produce more creative and random text, while lower values (e.g., 0.2) create more focused and deterministic text. It is recommended to alter either temperature or top_p, but not both. "MiniMax-M1" defaults to 1 and "MiniMax-Text-01" to 0.1 |
| top_p | `float` [0, 1] | Optional | This parameter, an alternative to temperature, controls the diversity of the generated text through nucleus sampling. A value of 0.1 means only the top 10% of tokens by probability mass are considered. It is recommended to alter either `temperature` or `top_p`, but not both. It defaults to 0.95. |
| mask_sensitive_info | `boolean` | Optional | When enabled, this feature masks private information like emails, domain names, links, ID numbers, home addresses, etc. in the output by replacing them with '***'. It's enabled by default (`false`). |
| messages | `array` | **Required** | A list of messages that make up the conversation so far.  See the `message object` for more details. |
| tools | `array` | Optional | A list of tools the model can call. Only functions are currently supported as tools.  |
| response_format | `object` | Optional | Specifies the output format for "MiniMax-Text-01" as a JSON schema. Setting `{"type": "json_schema", "json_schema": {...}}` enables Structured Outputs to ensure the model's output matches your supplied JSON schema. |

### Response
| Parameter | Type | Description |
|---|---|---|
| id | `string`| A unique identifier for the chat completion. |
| choices | `array` | A list of chat completion choices. It can be more than one if `n` is greater than 1.|
| created | `integer` | The Unix timestamp (in seconds) of when the chat completion was created. |
| model | `string` | The model used for the chat completion. |
| object | `string` | The object type, which can be either `"chat.completion"` or `"chat.completion.chunk"`. |
| usage | `object` | Usage statistics for the completion request.  See `usage object` for more information.|

### Example
**Request**
```bash
curl --location "https://api.minimax.io/v1/text/chatcompletion_v2" \
--header "Content-Type: application/json" \
--header "Authorization: Bearer $MiniMax_API_KEY" \
--data '{ "model":"MiniMax-M1", "messages":[ { "role":"system", "name":"MiniMax AI" }, { "role":"user", "name":"user", "content":"Hello" } ] }'
```
**Response**
```json
{
    "id": "02ff79af3ae4660b860cef2d15c661a7",
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "Hello! How can i help you?",
                "role": "assistant"
            }
        }
    ],
    "created": 1722828464,
    "model": "MiniMax-M1",
    "object": "chat.completion",
    "usage": {
        "total_tokens": 73
    },
    "base_resp": {
        "status_code": 0,
        "status_msg": ""
    }
}
```

# Batch API

The Batch API allows for asynchronous processing of large batches of API requests, with completions returned within 24 hours at a 50% discount. 

## Create a Batch

*   **Endpoint:** POST https://api.minimax.io/v1/batches
*  **Request Body:**

| Parameter           | Type     | Required | Description                                                                                                                                                                                |
|---------------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `input_file_id`     | string   | **Yes**  | The File ID of an uploaded JSONL file containing the requests for the new batch. The file must be uploaded with `purpose="batch"`, can contain up to 50,000 requests, and be up to 100 MB.    |
| `endpoint`          | string   | **Yes**  | The API endpoint to be used for all requests in the batch. Currently, only `/v1/text/chatcompletion_v2` is supported.                                                                           |
| `completion_window` | string   | **Yes**  | The time frame for processing the batch. Currently, only "24h" is supported.                                                                                                                |

*  **Returns:** The created Batch object.
*   **Example:**

**Upload File:**
```
curl --location 'https://api.minimax.io/v1/files/upload' \
--header 'Authorization: ---' \
--form 'purpose="batch"' \
--form 'file=@"/Users/minimax/py/dafei/xx.jsonl"'
```

**Request:**

```bash
curl --location 'https://api.minimax.io/v1/batches' \
--header 'Content-Type: application/json' \
--header 'Authorization: ---' \
--data '{
    "input_file_id": "193117143535681",
    "endpoint": "/v1/text/chatcompletion_v2",
    "completion_window": "24h",
    "callback_url": "http://minimax-xxxx"
}'
```

**Returns:**
```json
{
    "id": "batch_QPMrvCYDgGUzGkfoYDY5UfbR",
    "object": "batch",
    "endpoint": "/v1/text/chatcompletion_v2",
    "errors": null,
    "input_file_id": "198533392248503",
    "completion_window": "24h",
    "status": "validating",
    "output_file_id": null,
    "error_file_id": null,
    "created_at": 1725438001,
    "in_progress_at": null,
    "expires_at": 1725524401,
    "completed_at": null,
    "failed_at": null,
    "expired_at": null,
    "cancelling_at": null,
    "cancelled_at": null,
    "request_counts": {
        "total": 0,
        "completed": 0,
        "failed": 0
    },
    "callback_url": "xxx"
}
```

## Retrieve Batch
*   **Endpoint:** GET `https://api.minimax.io/v1/batches/{batch_id}`
*   **Path Parameters:** `batch_id` - The ID of the batch to retrieve.
*   **Returns:** The Batch object matching the specified ID.

**Request:**

```bash
curl --location 'http://api.minimax.io/v1/batches/196362636480578' \
--header 'Authorization: ---'
```

**Returns:**
```json
{
    "id": "batch_rSkJCary2evmNez7VpE7v2Vj",
    "object": "batch",
    "endpoint": "/v1/text/chatcompletion_v2",
    "errors": null,
    "input_file_id": "198533392249503",
    "completion_window": "24h",
    "status": "completed",
    "output_file_id": "198533392248503",
    "error_file_id": null,
    "created_at": 1725437896,
    "in_progress_at": 1725437897,
    "expires_at": 1725524296,
    "finalizing_at": 1725438200,
    "completed_at": 1725438201,
    "failed_at": null,
    "expired_at": null,
    "cancelling_at": null,
    "cancelled_at": null,
    "request_counts": {
        "total": 2,
        "completed": 2,
        "failed": 0
    },
    "callback_url": "xxx"
}
```

## Cancel Batch
*   **Endpoint:** POST `https://api.minimax.io/v1/batches/{batch_id}/cancel`
*   **Path Parameters:** `batch_id` - The ID of the batch to cancel.
*   **Returns:** The Batch object matching the specified ID.

**Request:**

```bash
curl --location --request POST 'http://api.minimax.io/v1/batches/196362636480578/cancel' \
--header 'Authorization: ---'
```

**Returns:**
```json
{
    "id": "batch_rSkJCary2evmNez7VpE7v2Vj",
    "object": "batch",
    "endpoint": "/v1/text/chatcompletion_v2",
    "errors": null,
    "input_file_id": "198533392278503",
    "completion_window": "24h",
    "status": "completed",
    "output_file_id": "198533392248503",
    "error_file_id": null,
    "created_at": 1725437896,
    "in_progress_at": 1725437897,
    "expires_at": 1725524296,
    "finalizing_at": 1725438200,
    "completed_at": 1725438201,
    "failed_at": null,
    "expired_at": null,
    "cancelling_at": null,
    "cancelled_at": null,
    "request_counts": {
        "total": 2,
        "completed": 2,
        "failed": 0
    },
    "callback_url": "xxx"
}
```
## List batch
* **Endpoint:** `GET https://api.minimax.io/v1/batches`
* **Query Parameters:**
| Parameter | Type   | Description |
|-----------|--------|-------------|
| limit     | `int`  | A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20. |
| after     | `string`| A cursor for use in pagination. after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list. |

*   **Returns:** A list of paginated `Batch` objects.

**Request:**

```bash
curl https://api.minimax.io/v1/batches?limit=2 \
-H "Authorization: Bearer $MiniMax_API_KEY" \
-H "Content-Type: application/json"
```

**Returns:**
```json
{
  "object": "list",
  "data": [
    {
      "id": "batch_abc123",
      "object": "batch",
      "endpoint": "/v1/text/chatcompletion_v2",
      "errors": null,
      "input_file_id": "198533392228503",
      "completion_window": "24h",
      "status": "completed",
      "output_file_id": "198533392228503",
      "error_file_id": "file-HOWS94",
      "created_at": 1711471533,
      "in_progress_at": 1711471538,
      "expires_at": 1711557933,
      "finalizing_at": 1711493133,
      "completed_at": 1711493163,
      "failed_at": null,
      "expired_at": null,
      "cancelling_at": null,
      "cancelled_at": null,
      "request_counts": {
        "total": 100,
        "completed": 95,
        "failed": 5
      }
    },
    {
      ...
    },
  ]
}
```

# Text to Speech (T2A)

This API supports synchronous text-to-speech audio generation, with a maximum of 5000 characters of input.

## Features

- 100+ existing voices to choose
- Adjustable volume, tone, speed, and output format for every voice
- Weighted voice mixing
- Detailed manual control of pauses and lulls in speech
- Multiple audio specifications and formats
- Real-time streaming

This API can be used for phrase generation, voice chat, online social networking sites, and more. 

- **MiniMax MCP GitHub**: [https://github.com/MiniMax-AI/MiniMax-MCP](https://github.com/MiniMax-AI/MiniMax-MCP)
- **API Endpoint**: `https://api.minimax.io/v1/t2a_v2`

## Models

The following models support 24 languages including English (US, UK, Australia, India), Chinese (Mandarin and Cantonese), Japanese, Korean, French, German, Spanish, Portuguese (Brazilian), Italian, Arabic, Russian, Turkish, Dutch, Ukrainian, Vietnamese, and Indonesian, Thai, Polish, Romanian, Greek, Czech, Finnish, Hindi.

- **speech-02-hd**: High-definition model with superior rhythm and stability.
- **speech-02-turbo**: High-performance model with enhanced multilingual capabilities.
- **speech-01-hd**: Rich voices, expressive emotions, and authentic languages.
- **speech-01-turbo**: Excellent performance and low latency.

## Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| Authorization | `string` | **Yes** | Your API key. |
| Content-Type | `application/json` | **Yes** | The content type of the request body. |
| Groupid | `string` | **Yes** | The group to which the user belongs, appended to the URL. |
| model | `string` | **Yes** | The desired model: "speech-02-hd", "speech-01-turbo", etc. |
| text | `string` | **Yes** | The text to be synthesized (< 5000 characters). You can add a pause using `<#x#>` where `x` is the duration in seconds. |
| voice_setting | `object` | Yes | See `voice_setting` object for details. |
| audio_setting | `object` | Yes | See `audio_setting` object for details. |
| pronunciation_dict | `object` | Optional | A dictionary for pronunciation. |
| timber_weights | `object` | Required if no `voice_id` | See `timber_weights` object for details. |
| stream | `boolean` | Optional | If `true`, the audio will be streamed. Default is `false`. |
| language_boost | `string` | Optional | Enhances recognition of specified languages. Supported values include: 'Chinese', 'Chinese,Yue', 'English', etc. |
| subtitle_enable | `boolean` | Optional | Enables the subtitle service (default: `false`, non-streaming only). |
| output_format | `string` | Optional | 'url' or 'hex' (default: 'hex'). Only 'hex' is supported for streaming. |

## Response

| Parameter | Type | Description |
|---|---|---|
| data | `object` | Contains the audio data and status. |
| trace_id | `string` | The ID of the current conversation. |
| subtitle_file | `string` | The download link for the synthesized subtitles. |
| extra_info | `object` | Additional information about the audio. |
| base_resp | `object` | Error codes, status messages, and corresponding details. |


### Non-streaming Example
**Request**

```python
import requests
import json
group_id = "your_group_id"
api_key = "your_api_key"
url = f"https://api.minimax.io/v1/t2a_v2?GroupId={group_id}"

payload = json.dumps({
    "model":"speech-02-hd",
    "text":"The real danger is not that computers start thinking like people, but that people start thinking like computers. Computers can only help us with simple tasks.",
    "stream":False,
    "voice_setting":{
        "voice_id":"Grinch",
        "speed":1,
        "vol":1,
        "pitch":0
    },
    "audio_setting":{
        "sample_rate":32000,
        "bitrate":128000,
        "format":"mp3",
        "channel":1
    }
})

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.request("POST", url, stream=True, headers=headers, data=payload)
parsed_json = json.loads(response.text)
# get audio
audio_value = bytes.fromhex(parsed_json['data']['audio'])
with open('output.mp3', 'wb') as f:
    f.write(audio_value)
```
**Response**
```json
{
    "data":{
        "audio":"hex audio",
        "status":2,
        "subtitle_file":"https://minimax-algeng-chat-tts.oss-cn-wulanchabu.aliyuncs.com/XXXX",
    },
    "extra_info":{
        "audio_length":5746,
        "audio_sample_rate":32000,
        "audio_size":100845,
        "audio_bitrate":128000,
        "word_count":300,
        "invisible_character_ratio":0,
        "audio_format":"mp3",
        "usage_characters":630
    },
    "trace_id":"01b8bf9bb7433cc75c18eee6cfa8fe21",
    "base_resp":{
        "status_code":0,
        "status_msg":""
    }
}
```

### Streaming Example

```python
import json
import subprocess
import time
from typing import Iterator
import requests

group_id = ''    #your_group_id
api_key = ''    #your_api_key
file_format = 'mp3'  # support mp3/pcm/flac
url = "https://api.minimax.io/v1/t2a_v2?GroupId=" + group_id

headers = {"Content-Type":"application/json", "Authorization":"Bearer " + api_key}

def build_tts_stream_headers() -> dict:
    headers = {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'authorization': "Bearer " + api_key,
    }
    return headers

def build_tts_stream_body(text: str) -> dict:
    body = json.dumps({
        "model":"speech-02-turbo",
        "text":"The real danger is not that computers start thinking like people, but that people start thinking like computers. Computers can only help us with simple tasks.",
        "stream":True,
        "voice_setting":{
            "voice_id":"male-qn-qingse",
            "speed":1.0,
            "vol":1.0,
            "pitch":0
        },
        "audio_setting":{
            "sample_rate":32000,
            "bitrate":128000,
            "format":"mp3",
            "channel":1
        }
    })
    return body

mpv_command = ["mpv", "--no-cache", "--no-terminal", "--", "fd://0"]
mpv_process = subprocess.Popen(
    mpv_command,
    stdin=subprocess.PIPE,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

def call_tts_stream(text: str) -> Iterator[bytes]:
    tts_url = url
    tts_headers = build_tts_stream_headers()
    tts_body = build_tts_stream_body(text)

    response = requests.request("POST", tts_url, stream=True, headers=tts_headers, data=tts_body)
    for chunk in (response.raw):
        if chunk:
            if chunk[:5] == b'data:':
                data = json.loads(chunk[5:])
                if "data" in data and "extra_info" not in data:
                    if "audio" in data["data"]:
                        audio = data["data"]['audio']
                        yield audio

def audio_play(audio_stream: Iterator[bytes]) -> bytes:
    audio = b""
    for chunk in audio_stream:
        if chunk is not None and chunk != '\n':
            decoded_hex = bytes.fromhex(chunk)
            mpv_process.stdin.write(decoded_hex)  # type: ignore
            mpv_process.stdin.flush()
            audio += decoded_hex
    return audio

audio_chunk_iterator = call_tts_stream('')
audio = audio_play(audio_chunk_iterator)
# save results to file
timestamp = int(time.time())
file_name = f'output_total_{timestamp}.{file_format}'
with open(file_name, 'wb') as file:
    file.write(audio)

```

## Websocket API
- **API Endpoint:** wss://api.minimax.io/ws/v1/t2a_v2

### 1. Create a WebSocket Connection
*  **Request:** 
  ```json
  { "Authorization":"Bearer your_api_key"}
  ```
*   **Response (success):**
  ```json
  { "session_id":"xxxx", "event":"connected_success" "trace_id":"0303a2882bf18235ae7a809ae0f3cca7", "base_resp":{ "status_code":0, "status_msg":"success" } }
  ```

### 2. Send "task_start" event
*   **Request:** 
    ```json
    {
      "event": "task_start",
      "model": "speech-02-turbo",
      "language_boost": "English",
      "voice_setting": {
        "voice_id": "Wise_Woman",
        "speed": 1,
        "vol": 1,
        "pitch": 0,
        "emotion": "happy"
      },
      "pronunciation_dict": {},
      "audio_setting": {
        "sample_rate": 32000,
        "bitrate": 128000,
        "format": "mp3",
        "channel": 1
      }
    }
    ```
*  **Response (task_started):**
    ```json
    { "session_id":"xxxx", "event":"task_started", "trace_id":"0303a2882bf18235ae7a809ae0f3cca7", "base_resp":{ "status_code":0, "status_msg":"success" } }
    ```
### 3. Send "task_continue" event
*  **Request:**
    ```json
    {
    "event": "task_continue",
    "text": "Hello, this is the text message for test"
    }
    ```
* **Response:**
    ```json
    {
      "data": {
        "audio": "xxx"
      },
      "extra_info": {
        "audio_length": 935,
        "audio_sample_rate": 32000,
        "audio_size": 15597,
        "bitrate": 128000,
        "word_count": 1,
        "invisible_character_ratio": 0,
        "usage_characters": 4,
        "audio_format": "mp3",
        "audio_channel": 1
      },
      "session_id": "xxxx",
      "event": "task_continued",
      "is_final": false,
      "trace_id": "0303a2882bf18235ae7a809ae0f3cca7",
      "base_resp": {
        "status_code": 0,
        "status_msg": "success"
      }
    }

    ```

### 4. Send "task_finish" event
*   **Request:**
  ```json
  { "event":"task_finish" }
  ```

*   **Response:**
  ```json
  {
    "session_id":"xxxx",
    "event":"task_finished",
    "trace_id":"0303a2882bf18235ae7a809ae0f3cca7",
    "base_resp":{ "status_code":0, "status_msg":"success" }
  }
  ```

### WebSocket API Call Sample (Python with asyncio and websockets)
```python
import asyncio
import websockets
import json
import ssl
from pydub import AudioSegment
from pydub.playback import play
from io import BytesIO

MODULE = "speech-02-hd"
EMOTION = "happy"

async def establish_connection(api_key):
    # ... (code for establishing WebSocket connection)

async def start_task(websocket, text):
    # ... (code for sending task_start event)

async def continue_task(websocket, text):
    # ... (code for sending task_continue and receiving audio)

async def close_connection(websocket):
    # ... (code for closing the WebSocket connection)

async def main():
    API_KEY = "your_api_key_here"
    TEXT = "Hello, this is a text message for test"
    ws = await establish_connection(API_KEY)
    if not ws:
        return
    try:
        if not await start_task(ws, TEXT[:10]):
            print("Failed to start task")
            return
        hex_audio = await continue_task(ws, TEXT)
        # Decode hex audio data
        audio_bytes = bytes.fromhex(hex_audio)
        # Save as MP3 file
        with open("output.mp3", "wb") as f:
            f.write(audio_bytes)
        print("Audio saved as output.mp3")
        # Directly play audio (requires pydub and simpleaudio)
        audio = AudioSegment.from_file(BytesIO(audio_bytes), format="mp3")
        print("Playing audio...")
        play(audio)
    finally:
        await close_connection(ws)

if __name__ == "__main__":
    asyncio.run(main())
```

# Async Long TTS (T2A Async)

## Create Speech Generation Task
*   **API Endpoint:** `https://api.minimax.io/v1/t2a_async_v2`
*   **Request:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| Authorization | `string` | **Yes** | Your API key. |
| Content-Type | `application/json` | **Yes** | The content type of the request body. |
| GroupId | `string` | **Yes** | Your group_id, appended to the API call URL. |
| model | `string` | **Yes** | Desired model, including: `speech-02-hd`, `speech-02-turbo`, `speech-01-hd`, `speech-01-turbo`. |
| text | `string` | One of `text` or `text_file_id` is required. | The text to be synthesized (max 50,000 characters). You can insert pauses with `<#x#>` where x is in seconds (e.g., `<#1.5#>`). |
| text_file_id | `int64` | One of `text` or `text_file_id` is required. | The file ID of the text to be synthesized. Supported formats are .txt and .zip. |
| voice_setting | `object` | **Yes** | See `voice_setting` object for details. |
| audio_setting | `object` | **Yes** | See `audio_setting` object for details. |
| pronunciation_dict | `object` | Optional | Dictionary for custom pronunciations. |
| language_boost | `string` | Optional | Enhances language and dialect recognition. |
*   **Response:**
| Parameter | Type | Description |
|---|---|---|
| task_id | `string` | The ID of the task. |
| task_token | `string` | A unique key for the task. |
| file_id | `int64` | The ID of the file for the result, available upon task completion. |
| base_resp | `object` | Status codes and details. |

## Query of Generation Status
*   **API Endpoint:** `http://api.minimax.io/v1/query/t2a_async_query_v2`
*   **Request:**
    *   **GroupId:** Required. Your group ID.
    *   **task_id:** Required. The ID of the task.
*   **Response:**
| Parameter | Type | Description |
|---|---|---|
| task_id | `int` | The ID of the task. |
| status | `string` | "Processing", "Success", "Failed", or "Expired" |
| file_id | `int64` | If successful, the ID of the file to download the audio from. |
| base_resp | `object` | Status codes and details. |

# Quick Voice Cloning

This feature allows you to clone a voice from an audio file.

## File Upload API
*   **API Endpoint:** `https://api.minimax.io/v1/files/upload`
*   **Request Parameters:**
    *   **Authorization:** Required. Your API key.
    *   **Content-Type:** Required. `multipart/form-data`
    *   **purpose:** Required. Must be "voice_clone".
    *   **file:** Required. The binary file.
*   **File Requirements:**
    *   **Formats:** MP3, M4A, WAV
    *   **Duration:** 10s to 5min
    *   **Size:** Less than 20MB
* **Response** 
  * A JSON object containing the `file_id` for the uploaded audio.
 
## Voice Clone API

*   **API Endpoint:** `https://api.minimax.io/v1/voice_clone`
*   **Request Parameters:**
    *   `file_id`: Required. The ID of the audio file to clone.
    *   `voice_id`: Required. A custom ID for the cloned voice (at least 8 characters, with letters and numbers, starting with a letter).
    *   `need_noise_reduction`: Optional. Boolean to enable noise reduction (default: false).
    *   `text`: Optional. Text to generate a preview audio.
    *   `model`: Optional. TTS model for the preview.
    *   `accuracy`: Optional. A float between 0 and 1 for text validation accuracy.
    *   `need_volume_normalization`: Optional. A boolean to enable volume normalization (default: false).
* **Response**
    *   A JSON object with a status code and message. A successful response indicates the cloning process has started.


## Voice Design
* **API:** https://api.minimax.io/v1/voice_design
* **Request:** 
| Parameter | Type | Required| Description|
| --- | --- | ---| --- |
| Authorization | `string` | Required| Bearer Token Authentication. |
| prompt |`string` | Required | Voice description.|
| preview_text |`string` | Required| Text for audio preview, limited to 500 characters. |
| voice_id | `string` | Optional | You can specify a custom voice_id for the generated voice. |
* **Response**
| Parameter | Type | Description|
| --- | --- | ---|
| voice_id | `string` | The voice_id of the generated voice. |
| trial_audio |`string` | The preview audio, using the generated voice, is returned in hex-encoded format. |
| base_resp | `object`| Status code and its details. |

# Get/Delete Voice
## Get Voice
* **API:** https://api.minimax.io/v1/get_voice
* **Request Parameters**
| Parameter | Type | Required| Description|
| --- | --- | ---| --- |
| Authorization |`string` | Required | HTTP Bearer Auth.|
| voice_type |`string`| Required| "system", "voice_cloning", "voice_generation", "music_generation", or "all". |
* **Response:**
  * Returns an object containing arrays of `voice_slots`, `system_voice`, `voice_cloning`, `voice_generation`, and `music_generation` based on the request.
## Delete Voice
* **API:** https://api.minimax.io/v1/delete_voice
* **Request Parameters:**
| Parameter | Type | Required| Description|
| --- | --- | ---| --- |
| Authorization | `string` | Required | Your API Key.|
| GroupId | `string` | Required | Your group_id, appended to the URL |
| voice_type | `string` | Required | "voice_cloning" or "voice_generation" |
| voice_id | `string`| Required | The ID of the voice to delete |

* **Response:**
  * A JSON object confirming the deletion, including the deleted `voice_id` and creation timestamp.

# Video Generation
This API allows for asynchronous creation of videos from text or images.
## Models
| Model | Description |
|---|---|
| MiniMax-Hailuo-02 | Video generation model, supports 1080P, up to 10s duration |
| T2V-01-Director | Text-to-video generation model with enhanced shot control. 720P, 25FPS |
| I2V-01-Director | Image-to-video generation model with enhanced shot control. 720P, 25FPS |
| S2V-01 | Subject Reference video generation model. 720P, 25FPS |

## Create Video Generation Task

* **Endpoint**: `POST https://api.minimax.io/v1/video_generation`
* **Request Parameters**: 
| Parameter | Type | Required| Description |
|---|---|---|---|
| Authorization| `string`| **Yes** | Your API key. |
| header| `string` of `application/json` | **Yes**| Content-type. |
| model|`string` | **Yes**| ID of the model you want to use|
|prompt |`string`| Optional | Description of the video. (max 2000 chars)|
| prompt_optimizer | `boolean` | Optional | If `True`, the model will optimize the prompt. Default is `True` |
| duration | `int`| Optional| Video length in seconds. |
| resolution | `string` | Optional | Video resolution, eg: 720P, 1080P |
| first_frame_image |`string` | Required (I2V) | The model will use the image as the first frame. The URL or base64 encoded image is supported. |
| subject_reference| `array`| Optional| An array of subjects for reference, for S2V-01 model. Only one subject is currently supported. |
| callback_url | `string` | Optional | If provided, MiniMax server will send a validation request to this URL and then send task status updates. |

## Query of Generation Status

* **Endpoint**: `GET https://api.minimax.io/v1/query/video_generation?task_id={task_id}`
* **Request Parameters**:
| Parameter | Type | Required| Description|
| --- | ---| --- | --- |
| Authorization| `string`| **Yes** | Your API key. |
| task_id | `string`| **Yes** | The ID of the task to query. |

* **Response**: A JSON object with the task status and, if successful, the file ID of the generated video.

## Retrieve the download URL of the video file

* **Endpoint**: `POST: https://api.minimax.io/v1/files/retrieve?GroupId={group_id}&file_id={file_id}`
* **Request Parameters**:
| Parameter | Type | Required| Description|
| --- | --- |---| --- |
| Authorization| `string`| **Yes** | API key you got from account setting.|
| Content-type| `application/json` | **Yes**| Content-type.|
| GroupId | `string`| **Yes**| Unique identifier for your account.|
| file_id | `string`| **Yes**| Unique Identifier for the file, you got it from the previous step.|

* **Response**: A JSON object containing file metadata and the download URL.

## Full Example Code

```python
import os
import time
import requests
import json
api_key = "Fill in the API Key"
prompt = "Description of your video"
model = "MiniMax-Hailuo-02"
output_file_name = "output.mp4"

def invoke_video_generation()->str:
  # ... implementation to submit a video generation task ...

def query_video_generation(task_id: str):
  # ... implementation to query the task status ...

def fetch_video_result(file_id: str):
  # ... implementation to download the video result ...

if __name__ == '__main__':
    task_id = invoke_video_generation()
    print("-----------------Video generation task submitted -----------------")
    while True:
        time.sleep(10)
        file_id, status = query_video_generation(task_id)
        if file_id != "":
            fetch_video_result(file_id)
            print("---------------Successful---------------")
            break
        elif status == "Fail" or status == "Unknown":
            print("---------------Failed---------------")
            break
```


# Music Generation API

This API supports creating AI music from text prompts, lyrics, or by using a reference audio track.

## Models
| Model | Description |
|---|---|
| music-1.5| Generate the AI music with text prompt and lyrics. |
| music-01| Generate the AI music with the voice_id, instrumental_id, and lyrics. |

## Upload API
* **API**: `https://api.minimax.io/v1/music_upload`
* **Request**:
  | Parameter     | Type                         | Required | Description                                                                                                                                                                                |
  |---------------|------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | `Authorization` | string                       | **Yes**      | API key                                                                                                                                                                                    |
  | `file`        | Audio file path              | **Yes**      | WAV or MP3 format. Duration between 10s and 10 minutes.                                                                                                                                   |
  | `purpose`     | `song`/`voice`/`instrumental` | **Yes**      | 1. **song**: Uploads a music file with both vocals and accompaniment. Outputs `voice_id` and `instrumental_id`. <br> 2. **voice**: Uploads a file with only vocals. Outputs `voice_id`. <br> 3. **instrumental**: Uploads a file with only accompaniment. Outputs `instrumental_id`. |
* **Response**:
  * `voice_id` (if purpose is `song` or `voice`)
  * `instrumental_id` (if purpose is `song` or `instrumental`)
  * `base_resp`: Status and error information.
 
## Music Generation API
* **API**: `https://api.minimax.io/v1/music_generation`
* **Request**:
| Parameter | Type | Required| Description|
|---|---|---|---|
| Authorization | `string`| **Yes**| Your API key.|
|refer_voice| `string`| One of refer_voice or refer_instrumental is required.| The voice_id for the reference voice. If only this is provided, the output is an a cappella vocal. |
| refer_instrumental| `string`| One of refer_voice or refer_instrumental is required.| The instrumental_id for the reference instrumental. If only this is provided, the output is purely instrumental.|
| model | `string` | **Yes**| 'music-1.5' or 'music-01' |
| lyrics | `string` | **Yes for music-1.5** |  For `music-1.5`, lyrics are required (10-600 characters). You can use tags like [intro], [verse], etc. For `music-01`, lyrics are optional (0-200 characters). |
| prompt |`string`|**Yes for music-1.5** | Text prompt to guide music generation (10-300 characters).|
|audio_setting | `object`| Yes | Audio settings like sample rate, bitrate, and format. |
* **Response**:
  * `data`: Contains the audio in hex-encoded format and the status.
  * `base_resp`: Status and error information.
---
# Image Generation

This API allows you to generate images of various sizes and specifications based on your prompts.

## Models
* **image-01:** Minimax's self-developed, high-quality, high-performance text-to-image & image-to-image model.

## Create Image Generation
* **Endpoint:** `POST https://api.minimax.io/v1/image_generation`
* **Request Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `Authorization`|`string` |**Yes**| Your API key. |
|`header`| `string` of `application/json` | **Yes** | Content-type. |
|`model`| `string`|**Yes**| Model ID. Use "image-01".|
|`prompt`| `string`| **Yes** | A description of the image to generate. Max 1500 characters.|
| `subject_reference` | `array` | Optional | Reference a subject for generation. Only one subject is currently supported. |
|`aspect_ratio`| `string` |Optional | Controls the image aspect ratio. Options include: `1:1`, `16:9`, `4:3`, `3:2`, `2:3`, `3:4`, `9:16`, `21:9`. Default is `1:1`.|
|`width`|`int`, [512, 2048]|Optional| The width of the image in pixels. Must be a multiple of 8.|
|`height`|`int`, [512, 2048]|Optional| The height of the image in pixels. Must be a multiple of 8. |
|`response_format`|`string`| Optional| The format of the returned image. Can be `url` or `base64`. Default is `url`. URL is valid for 24 hours. |
|`seed`|`int`|Optional| A random seed for reproducibility. If not provided, a random number is used. |
|`n`|`int`, [1,9]|Optional| The number of images to generate per request. Default is 1.|
| `prompt_optimizer`| `boolean`| Optional | Enable or disable automatic prompt optimization. Default is `false` |
* **Response**: 
  * `id`: A unique identifier for the request.
  * `data`: An object containing the generated image URLs or base64 data.
  * `metadata`: Additional information about the generation process, including success and failure counts.
  * `base_resp`: Status code and message.
  
### Request Example: Text to Image

```python
import requests
import json

url = "https://api.minimax.io/v1/image_generation"
api_key="your api key"
payload = json.dumps({
  "model": "image-01",
  "prompt": "men Dressing in white t shirt, full-body stand front view image :25, outdoor, Venice beach sign, full-body image, Los Angeles, Fashion photography of 90s, documentary, Film grain, photorealistic",
  "aspect_ratio": "16:9",
  "response_format": "url",
  "n": 3,
  "prompt_optimizer": True
})

headers = {
  'Authorization': f'Bearer {api_key}',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
print(response.json())
```
### Response
```json
{
 "id": "03ff3cd0820949eb8a410056b5f21d38",
  "data": {
    "image_urls": [
      "XXX",
      "XXX",
      "XXX"
    ]
  },
  "metadata": {
    "failed_count": "0",
    "success_count": "3"
  },
  "base_resp": {
    "status_code": 0,
    "status_msg": "success"
  }
}
```
# Error Codes

This section provides a reference for common error codes and their solutions.

| Error Code | Message                          | Solution                                                                                                   |
|------------|----------------------------------|------------------------------------------------------------------------------------------------------------|
| 1000       | unknown error                    | Please retry your requests later.                                                                          |
| 1001       | request timeout                  | Please retry your requests later.                                                                          |
| 1002       | rate limit                       | Please retry your requests later.                                                                          |
| 1004       | not authorized                   | Please check your api key and make sure it is correct and active.                                          |
| 1008       | insufficient balance             | Please check your account balance.                                                                         |
| 1024       | internal error                   | Please retry your requests later.                                                                          |
| 1026       | input new_sensitive              | Please change your input content.                                                                          |
| 1027       | output new_sensitive             | Please change your input content.                                                                          |
| 1033       | system error / mysql failed      | Please retry your requests later.                                                                          |
| 1039       | token limit                      | Please retry your requests later.                                                                          |
| 1041       | conn limit                       | Please contact us if the issue persists.                                                                   |
| 1042       | invisible character ratio limit  | Please check your input content for invisible or illegal characters.                                       |
| 1043       | The asr similarity check failed | Please check file_id and text_validation.                                                                   |
| 1044       | clone prompt similarity check failed | Please check clone prompt audio and prompt words.                                                      |
| 2013       | invalid params / glyph definition format error | Please check the request parameters.                                                         |
| 20132      | invalid samples or voice_id      | Please check your file_id (in Voice Cloning API), voice_id (in T2A v2 API, T2A Large v2 API) and contact us if the issue persists. |
| 2037       | voice duration too short / voice duration too long | Please adjust the duration of your file_id for voice clone.                                |
| 2039       | voice clone voice id duplicate | Please check the voice_id to ensure no duplication with the existing ones.                                   |
| 2042       | You don't have access to this voice_id | Please check whether you are the creator of this voice_id and contact us if the issue persists.         |
| 2045       | rate growth limit                | Please avoid sudden increases and decreases in requests.                                                  |
| 2048       | prompt audio too long            | Please adjust the duration of the prompt_audio file (<8s).                                                |
| 2049       | invalid api key                  | Please check your api key and make sure it is correct and active.                                          |