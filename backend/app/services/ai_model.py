import random
from transformers import pipeline
from app.services.emotion import classify_emotion

# Initialize chat pipeline with DialoGPT
chat_pipeline = None

SUPPORTIVE_PROMPT = (
    'You are a compassionate mental health companion. '
    'Respond with empathy, encouragement, and practical support. '
    'Keep your tone gentle, understanding, and non-judgmental.\n'
)


def get_chat_pipeline():
    global chat_pipeline
    if chat_pipeline is None:
        try:
            chat_pipeline = pipeline(
                'text-generation',
                model='microsoft/DialoGPT-small',
                return_full_text=False,
                truncation=True,
            )
        except Exception as e:
            print(f"Error loading DialoGPT: {e}")
            chat_pipeline = None
    return chat_pipeline


def build_prompt(message: str, emotion: str) -> str:
    return (
        f"{SUPPORTIVE_PROMPT}"
        f"Detected emotion: {emotion}.\n"
        f"User: {message}\n"
        "Assistant:"
    )


def is_supportive_response(reply: str) -> bool:
    supportive_keywords = ['feel', 'understand', 'support', 'here', 'help', 'safe', 'calm', 'breathe', 'sorry', 'listen']
    reply_lower = reply.lower()
    return any(keyword in reply_lower for keyword in supportive_keywords)


def is_echo_response(reply: str, message: str) -> bool:
    reply_lower = reply.lower().strip()
    message_lower = message.lower().strip()
    return (
        reply_lower == message_lower
        or message_lower in reply_lower
        or reply_lower in message_lower
    )


def clean_generated_text(raw_text: str, prompt: str) -> str:
    text = raw_text.strip()
    if text.startswith(prompt):
        text = text[len(prompt):].strip()
    if text.lower().startswith('assistant:'):
        text = text[len('assistant:'):].strip()
    return text


def get_response(message: str) -> dict:
    """Generate a natural conversational response using DialoGPT."""
    emotion = classify_emotion(message)
    pipeline_obj = get_chat_pipeline()
    prompt = build_prompt(message, emotion)

    if pipeline_obj:
        try:
            result = pipeline_obj(
                prompt,
                max_length=150,
                truncation=True,
                num_return_sequences=1,
                top_k=50,
                top_p=0.95,
                do_sample=True,
                pad_token_id=50256,
            )
            reply = clean_generated_text(result[0].get('generated_text', ''), prompt)

            if (
                not reply
                or len(reply) < 15
                or is_echo_response(reply, message)
                or not is_supportive_response(reply)
            ):
                reply = get_empathetic_response(emotion)

            return {
                'reply': reply,
                'emotion': emotion,
            }
        except Exception as e:
            print(f"Error generating response: {e}")
            return {
                'reply': get_empathetic_response(emotion),
                'emotion': emotion,
            }

    return {
        'reply': get_empathetic_response(emotion),
        'emotion': emotion,
    }


def get_empathetic_response(emotion: str) -> str:
    """Provide empathetic fallback response based on emotion."""
    responses = {
        'Happy': [
            'That sounds wonderful! I am so glad you are feeling this way. Tell me more about what is making you happy.',
            'Your joy is wonderful to hear! What has contributed to this positive mood?',
            'That is amazing! How can you sustain this great feeling?',
        ],
        'Sad': [
            'I hear you. It sounds like you are going through a difficult time. I am here to listen. What is bothering you?',
            'You seem to be feeling down. That is okay. Would you like to talk about what is on your mind?',
            'I understand. Sad feelings are valid. What would help you feel better right now?',
        ],
        'Angry': [
            'It sounds like something has upset you. That is a valid feeling. What happened?',
            'I can sense your frustration. Take a moment to breathe. What triggered this feeling?',
            'Anger is a signal. What do you need right now to feel better?',
        ],
        'Anxious': [
            'I sense some worry in your words. That is understandable. What is causing your anxiety?',
            'Anxiety can feel overwhelming. You are not alone. What specifically is worrying you?',
            'It sounds like you are feeling stressed. Would grounding techniques help you right now?',
        ],
        'Calm': [
            'Thank you for sharing. I am here to support you. What would you like to talk about?',
            'You seem balanced. What is on your mind today?',
            'I appreciate your openness. Tell me more about how you are feeling.',
        ],
    }

    response_list = responses.get(emotion, responses['Calm'])
    return random.choice(response_list)
