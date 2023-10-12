'use client'

import Link from 'next/link'
import { Breadcrumb, Row, Col } from 'react-bootstrap'
import { GeoAltFill, GlobeAmericas, CashCoin } from 'react-bootstrap-icons'
import DOMPurify from 'dompurify'
import { useGetJobById, useGetSimilarJobs } from '@/services/JobsService'
import Skills from '../Skills'

export default function Page({ params }: { params: { id: string } }) {
  const { data: job, isLoading } = useGetJobById(params.id)
  const { data: similarJobs } = useGetSimilarJobs(job)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!job) {
    return <div>No job found with given ID: {params.id}</div>
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Jobs</Breadcrumb.Item>
        <Breadcrumb.Item active>{job.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col xs={4}>
          <h1>{job.title}</h1>
          <div>{job.company}</div>
          <div className="d-flex gap-3">
            <div className="d-flex align-items-center mb-1">
              <GeoAltFill className="me-1"/> {job.location}
            </div>
            {job.isRemote &&
              <div className="d-flex align-items-center mb-1">
                <GlobeAmericas className="me-1"/> Remote {job.remotePercentage}%
              </div>
            }
          </div>

          <div className="mt-0">
            <CashCoin /> ${job.salaryMin} - ${job.salaryMax}
          </div>

          <Skills skills={job.requiredSkills} primary className="mt-2" />
          <Skills skills={job.optionalSkills} className="mt-3 mb-2" />

          {similarJobs && similarJobs.length > 0 &&
            <div className="mt-3">
              <h3 className="text-smaller">Similar jobs</h3>
              {similarJobs.map((similarJob) => (
                <div key={similarJob.id}>
                  <Link href={`/jobs/${similarJob.id}`}>
                    {similarJob.title}
                  </Link>
                </div>
              ))}
            </div>
          }
        </Col>
        <Col xs={8}>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description)}}
          />
        </Col>
      </Row>
    </div>
  )
}