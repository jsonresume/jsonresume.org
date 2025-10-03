import { NextResponse } from 'next/server';

export function processToolResponse(result) {
  // Check if tool was called
  if (result.toolCalls && result.toolCalls.length > 0) {
    const toolCall = result.toolCalls[0];
    if (toolCall.toolName === 'update_resume') {
      const { changes, explanation } = toolCall.args;
      return NextResponse.json({
        message: explanation,
        suggestedChanges: changes,
      });
    }
  }

  // No tool call - return text response
  return NextResponse.json({
    message: result.text,
    suggestedChanges: null,
  });
}
