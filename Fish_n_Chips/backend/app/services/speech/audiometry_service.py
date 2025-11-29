# Global state to track test progress (in production, use session storage)
_test_state = {}

def adaptive_threshold_test(frequency: int, current_volume: float, user_heard: bool, session_id: str = "default") -> dict:
    """
    Implements a simple staircase procedure for audiometry.
    For demo purposes, we'll complete after 2 steps.
    """
    # Initialize or get state
    if session_id not in _test_state:
        _test_state[session_id] = {"step_count": 0, "volumes": []}

    state = _test_state[session_id]
    state["step_count"] += 1
    state["volumes"].append(current_volume)

    print(f"Audiometry - Session: {session_id}, Step: {state['step_count']}, Volume: {current_volume}, Heard: {user_heard}")

    # Complete after 2 steps
    if state["step_count"] >= 2:
        threshold_db = int(current_volume * 100)
        print(f"Audiometry complete! Threshold: {threshold_db} dB")
        # Clean up state
        del _test_state[session_id]
        return {
            "continue_test": False,
            "next_volume": None,
            "threshold_db": threshold_db
        }

    # Adjust volume for next step
    step_size = 0.1
    if user_heard:
        next_volume = max(0.0, current_volume - step_size)
    else:
        next_volume = min(1.0, current_volume + step_size)

    print(f"Next volume: {next_volume}")

    return {
        "continue_test": True,
        "next_volume": round(next_volume, 2),
        "threshold_db": int(current_volume * 100)
    }
