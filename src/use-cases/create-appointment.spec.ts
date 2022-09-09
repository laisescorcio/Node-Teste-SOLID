import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointment";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { getFutureDate } from "../tests/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";

describe('Create Appointment', () => {

    it('should be be able to create an appointment', () => {
        const appointmentRepository = new InMemoryAppointmentsRepository()
        const createAppointment = new CreateAppointment(
            appointmentRepository
        )

        const startsAt = getFutureDate('2022-08-10')
        const endsAt = getFutureDate('2022-08-11')

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt
        })).resolves.toBeInstanceOf(Appointment)
    })

    it('should be not be able to create an appointment with overlapping dates', async () => {
        const appointmentRepository = new InMemoryAppointmentsRepository()
        const createAppointment = new CreateAppointment(
            appointmentRepository
        )

        const startsAt = getFutureDate('2022-08-10')
        const endsAt = getFutureDate('2022-08-15')

        await createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt
        })

        // comeca no meio e passa do periodo
        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-08-14'),
            endsAt: getFutureDate('2022-08-18')
        })).rejects.toBeInstanceOf(Error)

        // comeca antes e termina no meio do periodo
        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-08-08'),
            endsAt: getFutureDate('2022-08-12')
        })).rejects.toBeInstanceOf(Error)

        // comeca antes e passa do periodo
        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-08-08'),
            endsAt: getFutureDate('2022-08-17')
        })).rejects.toBeInstanceOf(Error)

        // datas no meio do periodo
        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt: getFutureDate('2022-08-11'),
            endsAt: getFutureDate('2022-08-12')
        })).rejects.toBeInstanceOf(Error)
    })
})