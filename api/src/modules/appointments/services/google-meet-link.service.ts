import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import { randomUUID } from 'crypto';

interface CreateMeetLinkParams {
  summary: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  timeZone: string;
  attendeeEmails?: string[];
}

@Injectable()
export class GoogleMeetLinkService {
  async createMeetLink(params: CreateMeetLinkParams) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
      throw new InternalServerErrorException('Google Calendar integration is not configured');
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: params.summary,
        description: params.description,
        start: {
          dateTime: params.startDateTime,
          timeZone: params.timeZone,
        },
        end: {
          dateTime: params.endDateTime,
          timeZone: params.timeZone,
        },
        attendees: params.attendeeEmails?.map((email) => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      },
    });

    const meetingLink = response.data.hangoutLink;

    if (!meetingLink) {
      throw new InternalServerErrorException('Google did not return a Meet link');
    }

    return meetingLink;
  }
}
